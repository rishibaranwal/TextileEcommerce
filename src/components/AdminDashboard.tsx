import { useState, useEffect } from 'react';
import { X, Plus, Edit2, Trash2, Package } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category_id: string | null;
  image_url: string;
  stock: number;
}

interface Category {
  id: string;
  name: string;
  description: string;
}

interface Order {
  id: string;
  user_id: string;
  total: number;
  status: string;
  created_at: string;
}

interface AdminDashboardProps {
  onClose: () => void;
}

export function AdminDashboard({ onClose }: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState<'products' | 'orders'>('products');
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [showProductForm, setShowProductForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category_id: '',
    image_url: '',
    stock: ''
  });

  useEffect(() => {
    fetchCategories();
    if (activeTab === 'products') fetchProducts();
    if (activeTab === 'orders') fetchOrders();
  }, [activeTab]);

  const fetchProducts = async () => {
    const { data } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });
    if (data) setProducts(data);
  };

  const fetchCategories = async () => {
    const { data } = await supabase
      .from('categories')
      .select('*');
    if (data) setCategories(data);
  };

  const fetchOrders = async () => {
    const { data } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });
    if (data) setOrders(data);
  };

  const handleSubmitProduct = async (e: React.FormEvent) => {
    e.preventDefault();

    const productData = {
      name: formData.name,
      description: formData.description,
      price: parseFloat(formData.price),
      category_id: formData.category_id || null,
      image_url: formData.image_url,
      stock: parseInt(formData.stock)
    };

    if (editingProduct) {
      await supabase
        .from('products')
        .update(productData)
        .eq('id', editingProduct.id);
    } else {
      await supabase
        .from('products')
        .insert([productData]);
    }

    setShowProductForm(false);
    setEditingProduct(null);
    setFormData({ name: '', description: '', price: '', category_id: '', image_url: '', stock: '' });
    fetchProducts();
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price.toString(),
      category_id: product.category_id || '',
      image_url: product.image_url,
      stock: product.stock.toString()
    });
    setShowProductForm(true);
  };

  const handleDeleteProduct = async (id: string) => {
    if (confirm('Are you sure you want to delete this product?')) {
      await supabase.from('products').delete().eq('id', id);
      fetchProducts();
    }
  };

  const updateOrderStatus = async (orderId: string, status: string) => {
    await supabase
      .from('orders')
      .update({ status })
      .eq('id', orderId);
    fetchOrders();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-6xl max-h-[90vh] overflow-hidden flex flex-col">
        <div className="p-6 border-b flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-800">Admin Dashboard</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={24} />
          </button>
        </div>

        <div className="flex border-b">
          <button
            onClick={() => setActiveTab('products')}
            className={`flex-1 py-3 px-4 flex items-center justify-center gap-2 ${
              activeTab === 'products' ? 'bg-blue-50 text-blue-600 border-b-2 border-blue-600' : 'text-gray-600'
            }`}
          >
            <Package size={18} />
            Products
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
          {activeTab === 'products' && (
            <div className="space-y-4">
              <button
                onClick={() => {
                  setEditingProduct(null);
                  setFormData({ name: '', description: '', price: '', category_id: '', image_url: '', stock: '' });
                  setShowProductForm(true);
                }}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
              >
                <Plus size={18} />
                Add Product
              </button>

              {showProductForm && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold mb-4">
                    {editingProduct ? 'Edit Product' : 'Add New Product'}
                  </h3>
                  <form onSubmit={handleSubmitProduct} className="space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <input
                        type="text"
                        placeholder="Product Name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="px-3 py-2 border rounded-lg"
                        required
                      />
                      <input
                        type="number"
                        placeholder="Price"
                        value={formData.price}
                        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                        className="px-3 py-2 border rounded-lg"
                        step="0.01"
                        required
                      />
                      <select
                        value={formData.category_id}
                        onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                        className="px-3 py-2 border rounded-lg"
                      >
                        <option value="">Select Category</option>
                        {categories.map((cat) => (
                          <option key={cat.id} value={cat.id}>{cat.name}</option>
                        ))}
                      </select>
                      <input
                        type="number"
                        placeholder="Stock"
                        value={formData.stock}
                        onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                        className="px-3 py-2 border rounded-lg"
                        required
                      />
                    </div>
                    <input
                      type="text"
                      placeholder="Image URL"
                      value={formData.image_url}
                      onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                      className="w-full px-3 py-2 border rounded-lg"
                    />
                    <textarea
                      placeholder="Description"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="w-full px-3 py-2 border rounded-lg"
                      rows={3}
                    />
                    <div className="flex gap-2">
                      <button
                        type="submit"
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                      >
                        {editingProduct ? 'Update' : 'Add'} Product
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setShowProductForm(false);
                          setEditingProduct(null);
                        }}
                        className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              )}

              <div className="space-y-3">
                {products.map((product) => (
                  <div key={product.id} className="bg-gray-50 p-4 rounded-lg flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold">{product.name}</h3>
                      <p className="text-sm text-gray-600">{product.description}</p>
                      <p className="text-blue-600 font-bold mt-1">${product.price}</p>
                      <p className="text-sm text-gray-500">Stock: {product.stock}</p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEditProduct(product)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                      >
                        <Edit2 size={18} />
                      </button>
                      <button
                        onClick={() => handleDeleteProduct(product.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'orders' && (
            <div className="space-y-4">
              {orders.length === 0 ? (
                <div className="text-center py-8 text-gray-500">No orders yet</div>
              ) : (
                orders.map((order) => (
                  <div key={order.id} className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <p className="font-semibold">Order #{order.id.slice(0, 8)}</p>
                        <p className="text-sm text-gray-600">
                          {new Date(order.created_at).toLocaleString()}
                        </p>
                        <p className="text-blue-600 font-bold mt-1">${order.total.toFixed(2)}</p>
                      </div>
                      <select
                        value={order.status}
                        onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                        className={`px-3 py-1 rounded text-sm border ${
                          order.status === 'pending' ? 'bg-yellow-50 border-yellow-300' :
                          order.status === 'completed' ? 'bg-green-50 border-green-300' :
                          'bg-gray-50 border-gray-300'
                        }`}
                      >
                        <option value="pending">Pending</option>
                        <option value="processing">Processing</option>
                        <option value="shipped">Shipped</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
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
