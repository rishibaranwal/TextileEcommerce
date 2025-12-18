import { useState, useEffect } from 'react';
import { User, ShoppingBag, Package, X, Minus, Plus } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';

interface CartItem {
  id: string;
  product_id: string;
  quantity: number;
  product: {
    id: string;
    name: string;
    price: number;
    image_url: string;
    stock: number;
  };
}

interface Order {
  id: string;
  total: number;
  status: string;
  created_at: string;
}

interface UserDashboardProps {
  onClose: () => void;
}

export function UserDashboard({ onClose }: UserDashboardProps) {
  const [activeTab, setActiveTab] = useState<'profile' | 'cart' | 'orders'>('cart');
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const { user, signOut } = useAuth();

  useEffect(() => {
    if (activeTab === 'cart') fetchCart();
    if (activeTab === 'orders') fetchOrders();
  }, [activeTab]);

  const fetchCart = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('cart_items')
      .select(`
        *,
        product:products(id, name, price, image_url, stock)
      `)
      .eq('user_id', user?.id);

    if (data) setCartItems(data as unknown as CartItem[]);
    setLoading(false);
  };

  const fetchOrders = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('orders')
      .select('*')
      .eq('user_id', user?.id)
      .order('created_at', { ascending: false });

    if (data) setOrders(data);
    setLoading(false);
  };

  const updateQuantity = async (itemId: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    await supabase
      .from('cart_items')
      .update({ quantity: newQuantity })
      .eq('id', itemId);
    fetchCart();
  };

  const removeFromCart = async (itemId: string) => {
    await supabase
      .from('cart_items')
      .delete()
      .eq('id', itemId);
    fetchCart();
  };

  const checkout = async () => {
    if (cartItems.length === 0) return;

    const total = cartItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);

    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert([{ user_id: user?.id, total, status: 'pending' }])
      .select()
      .single();

    if (orderError || !order) {
      alert('Failed to create order');
      return;
    }

    const orderItems = cartItems.map(item => ({
      order_id: order.id,
      product_id: item.product_id,
      quantity: item.quantity,
      price: item.product.price
    }));

    await supabase.from('order_items').insert(orderItems);
    await supabase.from('cart_items').delete().eq('user_id', user?.id);

    alert('Order placed successfully!');
    fetchCart();
    setActiveTab('orders');
  };

  const handleSignOut = async () => {
    await signOut();
    onClose();
  };

  const cartTotal = cartItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <div className="p-6 border-b flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-800">My Dashboard</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={24} />
          </button>
        </div>

        <div className="flex border-b">
          <button
            onClick={() => setActiveTab('profile')}
            className={`flex-1 py-3 px-4 flex items-center justify-center gap-2 ${
              activeTab === 'profile' ? 'bg-blue-50 text-blue-600 border-b-2 border-blue-600' : 'text-gray-600'
            }`}
          >
            <User size={18} />
            Profile
          </button>
          <button
            onClick={() => setActiveTab('cart')}
            className={`flex-1 py-3 px-4 flex items-center justify-center gap-2 ${
              activeTab === 'cart' ? 'bg-blue-50 text-blue-600 border-b-2 border-blue-600' : 'text-gray-600'
            }`}
          >
            <ShoppingBag size={18} />
            Cart ({cartItems.length})
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`flex-1 py-3 px-4 flex items-center justify-center gap-2 ${
              activeTab === 'orders' ? 'bg-blue-50 text-blue-600 border-b-2 border-blue-600' : 'text-gray-600'
            }`}
          >
            <Package size={18} />
            Orders
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === 'profile' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  value={user?.email || ''}
                  disabled
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50"
                />
              </div>
              <button
                onClick={handleSignOut}
                className="w-full bg-red-600 text-white py-2 rounded-lg hover:bg-red-700"
              >
                Sign Out
              </button>
            </div>
          )}

          {activeTab === 'cart' && (
            <div className="space-y-4">
              {loading ? (
                <div className="text-center py-8">Loading cart...</div>
              ) : cartItems.length === 0 ? (
                <div className="text-center py-8 text-gray-500">Your cart is empty</div>
              ) : (
                <>
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex gap-4 bg-gray-50 p-4 rounded-lg">
                      <div className="w-20 h-20 bg-gray-200 rounded flex-shrink-0">
                        {item.product.image_url && (
                          <img
                            src={item.product.image_url}
                            alt={item.product.name}
                            className="w-full h-full object-cover rounded"
                          />
                        )}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-800">{item.product.name}</h3>
                        <p className="text-blue-600 font-bold">${item.product.price}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="p-1 bg-gray-200 rounded hover:bg-gray-300"
                          >
                            <Minus size={16} />
                          </button>
                          <span className="px-3">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            disabled={item.quantity >= item.product.stock}
                            className="p-1 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
                          >
                            <Plus size={16} />
                          </button>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-gray-800">
                          ${(item.product.price * item.quantity).toFixed(2)}
                        </p>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="text-red-600 text-sm mt-2 hover:text-red-700"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ))}
                  <div className="border-t pt-4 mt-4">
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-xl font-bold">Total:</span>
                      <span className="text-2xl font-bold text-blue-600">${cartTotal.toFixed(2)}</span>
                    </div>
                    <button
                      onClick={checkout}
                      className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 font-semibold"
                    >
                      Checkout
                    </button>
                  </div>
                </>
              )}
            </div>
          )}

          {activeTab === 'orders' && (
            <div className="space-y-4">
              {loading ? (
                <div className="text-center py-8">Loading orders...</div>
              ) : orders.length === 0 ? (
                <div className="text-center py-8 text-gray-500">No orders yet</div>
              ) : (
                orders.map((order) => (
                  <div key={order.id} className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-sm text-gray-600">
                          Order #{order.id.slice(0, 8)}
                        </p>
                        <p className="text-sm text-gray-600">
                          {new Date(order.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-gray-800">${order.total.toFixed(2)}</p>
                        <span className={`text-sm px-2 py-1 rounded ${
                          order.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                          order.status === 'completed' ? 'bg-green-100 text-green-700' :
                          'bg-gray-100 text-gray-700'
                        }`}>
                          {order.status}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
