import { useState } from 'react';
import { ShoppingBag, User, Shield } from 'lucide-react';
import { useAuth } from './contexts/AuthContext';
import { supabase } from './lib/supabase';
import { AuthModal } from './components/AuthModal';
import { ProductCatalog } from './components/ProductCatalog';
import { UserDashboard } from './components/UserDashboard';
import { AdminDashboard } from './components/AdminDashboard';

function App() {
  const { user } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showUserDashboard, setShowUserDashboard] = useState(false);
  const [showAdminDashboard, setShowAdminDashboard] = useState(false);

  const handleAddToCart = async (productId: string) => {
    if (!user) {
      setShowAuthModal(true);
      return;
    }

    const { data: existingItem } = await supabase
      .from('cart_items')
      .select('*')
      .eq('user_id', user.id)
      .eq('product_id', productId)
      .maybeSingle();

    if (existingItem) {
      await supabase
        .from('cart_items')
        .update({ quantity: existingItem.quantity + 1 })
        .eq('id', existingItem.id);
    } else {
      await supabase
        .from('cart_items')
        .insert([{ user_id: user.id, product_id: productId, quantity: 1 }]);
    }

    alert('Added to cart!');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100">
      <header className="bg-white shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <ShoppingBag className="text-blue-600" size={32} />
              <div>
                <h1 className="text-2xl font-bold text-gray-800">TextileHub</h1>
                <p className="text-sm text-gray-600">Quality Fabrics & Home Textiles</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {user ? (
                <>
                  <button
                    onClick={() => setShowUserDashboard(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                  >
                    <User size={18} />
                    My Account
                  </button>
                  <button
                    onClick={() => setShowAdminDashboard(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-800 transition"
                  >
                    <Shield size={18} />
                    Admin
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setShowAuthModal(true)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                  Sign In
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Our Products</h2>
          <p className="text-gray-600">Discover premium fabrics and home textiles for every need</p>
        </div>
        <ProductCatalog onAddToCart={handleAddToCart} />
      </main>

      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
      {showUserDashboard && <UserDashboard onClose={() => setShowUserDashboard(false)} />}
      {showAdminDashboard && <AdminDashboard onClose={() => setShowAdminDashboard(false)} />}
    </div>
  );
}

export default App;
