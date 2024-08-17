const User = require('./Model/user.model');
const Product = require('./Model/product.model');
const Order = require('./Model/order.model');
const Category = require('./Model/category.model');

const resolvers = {
  Query: {
    users: async () => await User.find(),
    user: async (_, { id }) => await User.findById(id),
    products: async () => await Product.find().populate('category'),
    product: async (_, { id }) => await Product.findById(id).populate('category'),
    orders: async () => await Order.find().populate('user').populate('products.product'),
    order: async (_, { id }) => await Order.findById(id).populate('user').populate('products.product'),
    categories: async () => await Category.find(),
    category: async (_, { id }) => await Category.findById(id),
    searchProductsByName: async (_, { name }) => {
      return await Product.find({ name: new RegExp(name, 'i') }).populate('category');
    },
  },
  Mutation: {
    createUser: async (_, { name, email, phone, address, username, password, created_by }) => {
      const user = new User({ name, email, phone, address, username, password, created_by });
      return await user.save();
    },
    loginUser: async (_, { username, password }) => {
      const user = await User.findOne({ username });
      if (!user) throw new Error('User not found');

      // So sánh mật khẩu trực tiếp
      if (password !== user.password) throw new Error('Invalid password');

      // Trả về thông tin người dùng mà không cần token
      return user;
    },
    loginCustomer: async (_, { username, password }) => {
      const user = await User.findOne({ username });
      if (!user) throw new Error('User not found');

      // So sánh mật khẩu trực tiếp
      if (password !== user.password) throw new Error('Invalid password');

      // Trả về thông tin khách hàng mà không cần token
      return user;
  },
    deleteUser: async (_, { id }) => await User.findByIdAndDelete(id),
    updateUser: async (_, { id, name, email, phone, address }) => {
      const user = await User.findById(id);
      if (!user) throw new Error('User not found');
      user.name = name;
      user.email = email;
      user.phone = phone;
      user.address = address;
      await user.save();
      return user;
    },
    createProduct: async (_, { name, price, oldPrice, thumbnail, description, stock, category, brand, created_by }) => {
      const product = new Product({ 
        name, 
        price, 
        oldPrice, 
        thumbnail, 
        description, 
        category,
        stock, 
        brand, 
        created_by 
      });
      try {
        const savedProduct = await product.save();
        // Trả về sản phẩm với ID chuyển thành chuỗi
        return {
          id: savedProduct._id.toString(),
          name: savedProduct.name,
          price: savedProduct.price,
          description: savedProduct.description,
          category: {
            id: savedProduct.category.toString(),  // Chuyển ID thành chuỗi
            name: (await Category.findById(savedProduct.category)).name
          },
          brand: savedProduct.brand,
          created_by: savedProduct.created_by.toString() // Chuyển ID thành chuỗi
        };
      } catch (err) {
        console.error('Error creating product:', err.message);
        throw new Error('Failed to create product');
      }
    },
    deleteProduct: async (_, { id }) => await Product.findByIdAndDelete(id),
    updateProduct: async (_, { id, name, price, oldPrice, thumbnail, description, stock, category, brand, updated_by }) => {
      try {
        // Tìm sản phẩm theo ID
        const product = await Product.findById(id);
        if (!product) throw new Error('Product not found');

        // Cập nhật thông tin sản phẩm
        if (name !== undefined) product.name = name;
        if (price !== undefined) product.price = price;
        if (oldPrice !== undefined) product.oldPrice = oldPrice;
        if (thumbnail !== undefined) product.thumbnail = thumbnail;
        if (description !== undefined) product.description = description;
        if (stock !== undefined) product.stock = stock;
        if (category !== undefined) product.category = category;
        if (brand !== undefined) product.brand = brand;
        if (updated_by !== undefined) product.updated_by = updated_by;

        // Lưu sản phẩm đã được cập nhật vào cơ sở dữ liệu
        const updatedProduct = await product.save();

        // Trả về thông tin sản phẩm đã được cập nhật
        return {
          id: updatedProduct._id.toString(),
          name: updatedProduct.name,
          price: updatedProduct.price,
          oldPrice: updatedProduct.oldPrice,
          thumbnail: updatedProduct.thumbnail,
          description: updatedProduct.description,
          stock: updatedProduct.stock,
          category: updatedProduct.category,
          brand: updatedProduct.brand,
          created_by: updatedProduct.created_by,
          updated_by: updatedProduct.updated_by,
          created_at: updatedProduct.created_at.toISOString(),
          updated_at: updatedProduct.updated_at.toISOString()
        };
      } catch (error) {
        console.error('Error updating product:', error);
        throw new Error('Error updating product');
      }
    },
    createOrder: async (_, { userId, products, totalAmount }) => {
      try {
        const user = await User.findById(userId);
        if (!user) throw new Error('User not found');
    
        const orderProducts = await Promise.all(products.map(async (product) => {
          const foundProduct = await Product.findById(product.productId);
          if (!foundProduct) throw new Error('Product not found');
          return {
            product: foundProduct._id.toString(),  // Chuyển đổi ObjectId thành chuỗi
            quantity: product.quantity,
          };
        }));
    
        const order = new Order({ user: userId, products: orderProducts, totalAmount });
        const savedOrder = await order.save();
    
        // Trả về thông tin đơn hàng với ID chuyển đổi thành chuỗi
        return {
          id: savedOrder._id.toString(),
          user: {
            id: savedOrder.user.toString(),
            name: (await User.findById(savedOrder.user)).name
          },
          products: await Promise.all(savedOrder.products.map(async (p) => ({
            product: {
              id: (await Product.findById(p.product))._id.toString(),
              name: (await Product.findById(p.product)).name
            },
            quantity: p.quantity
          }))),
          totalAmount: savedOrder.totalAmount,
          status: savedOrder.status,
          created_at: savedOrder.created_at.toISOString(),
          updated_at: savedOrder.updated_at.toISOString()
        };
      } catch (error) {
        console.error('Error creating order:', error);
        throw new Error('Error creating order');
      }
    },
    
    
  

    createCategory: async (_, { name, description }) => {
      const category = new Category({ name, description });
      return await category.save();
    },
    deleteCategory: async (_, { id }) => await Category.findByIdAndDelete(id),
    updateCategory: async (_, { id, name, description }) => {
      const category = await Category.findById(id);
      if (!category) throw new Error('Category not found');
      if (name !== undefined) category.name = name;
      if (description !== undefined) category.description = description;
      category.updated_at = new Date().toISOString();
      await category.save();
      return category;
    },
    deleteOrder: async (_, { id }) => {
      try {
        // Xóa đơn hàng và trả về kết quả
        const deletedOrder = await Order.findByIdAndDelete(id);
        if (!deletedOrder) throw new Error('Order not found');
        return deletedOrder;
      } catch (error) {
        console.error('Error deleting order:', error);
        throw new Error('Error deleting order');
      }
    },
  },
};

module.exports = resolvers;
