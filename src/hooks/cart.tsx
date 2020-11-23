import React, {
  createContext,
  useState,
  useCallback,
  useContext,
  useEffect,
} from 'react';

import AsyncStorage from '@react-native-community/async-storage';

interface Product {
  id: string;
  title: string;
  image_url: string;
  price: number;
  quantity: number;
}

interface CartContext {
  products: Product[];
  addToCart(item: Omit<Product, 'quantity'>): void;
  increment(id: string): void;
  decrement(id: string): void;
}

const CartContext = createContext<CartContext | null>(null);

const CartProvider: React.FC = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    async function loadProducts(): Promise<void> {
      // TODO LOAD ITEMS FROM ASYNC STORAGE
    }

    loadProducts();
  }, []);

  const addToCart = useCallback(
    async product => {
      const productToAdd = {
        ...product,
        quantity: 1,
      };

      const isProductInCart = products.filter(item => {
        return productToAdd.id === item.id;
      });

      if (isProductInCart.length === 0) {
        setProducts([...products, productToAdd]);
      } else {
        const productToEdit =
          products.find(item => item.id === productToAdd.id) || ({} as Product);

        const newProducts = products.filter(
          item => item.id !== productToEdit.id,
        );

        const editedProduct = {
          ...productToEdit,
          quantity: productToEdit.quantity + 1,
        };

        setProducts([...newProducts, editedProduct]);
      }
    },
    [products],
  );

  const increment = useCallback(
    async id => {
      const productToEdit =
        products.find(item => item.id === id) || ({} as Product);

      const newProducts = products.filter(item => item.id !== productToEdit.id);

      const editedProduct = {
        ...productToEdit,
        quantity: productToEdit.quantity + 1,
      };

      setProducts([...newProducts, editedProduct]);
    },
    [products],
  );

  const decrement = useCallback(
    async id => {
      const productToEdit =
        products.find(item => item.id === id) || ({} as Product);

      const newProducts = products.filter(item => item.id !== productToEdit.id);

      const editedProduct = {
        ...productToEdit,
        quantity: productToEdit.quantity - 1,
      };

      setProducts([...newProducts, editedProduct]);
    },
    [products],
  );

  const value = React.useMemo(
    () => ({ addToCart, increment, decrement, products }),
    [products, addToCart, increment, decrement],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

function useCart(): CartContext {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error(`useCart must be used within a CartProvider`);
  }

  return context;
}

export { CartProvider, useCart };
