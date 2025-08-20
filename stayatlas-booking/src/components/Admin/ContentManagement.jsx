import React, { useState, useRef } from 'react';

const ContentManagement = () => {
  
  const [activeSection, setActiveSection] = useState('blogs');
  
 
  const [blogs, setBlogs] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [promotions, setPromotions] = useState([]);
  const [faqs, setFaqs] = useState([]);
  
 
  const blogFormRef = useRef(null);
  const testimonialFormRef = useRef(null);
  const promotionFormRef = useRef(null);
  const faqFormRef = useRef(null);
  
 
  const handleBlogSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(blogFormRef.current);
    const blogToAdd = {
      id: Date.now(),
      title: formData.get('title'),
      content: formData.get('content'),
      author: formData.get('author'),
      imageUrl: formData.get('imageUrl')
    };
    
    setBlogs([...blogs, blogToAdd]);
    blogFormRef.current.reset();
    alert('Blog post added successfully!');
  };
  
  const handleTestimonialSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(testimonialFormRef.current);
    const testimonialToAdd = {
      id: Date.now(),
      name: formData.get('name'),
      company: formData.get('company'),
      content: formData.get('content'),
      rating: Number(formData.get('rating'))
    };
    
    setTestimonials([...testimonials, testimonialToAdd]);
    testimonialFormRef.current.reset();
    alert('Testimonial added successfully!');
  };
  
  const handlePromotionSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(promotionFormRef.current);
    const promotionToAdd = {
      id: Date.now(),
      title: formData.get('title'),
      description: formData.get('description'),
      discount: formData.get('discount'),
      validUntil: formData.get('validUntil'),
      imageUrl: formData.get('imageUrl')
    };
    
    setPromotions([...promotions, promotionToAdd]);
    promotionFormRef.current.reset();
    alert('Promotion added successfully!');
  };
  
  const handleFaqSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(faqFormRef.current);
    const faqToAdd = {
      id: Date.now(),
      question: formData.get('question'),
      answer: formData.get('answer'),
      category: formData.get('category')
    };
    
    setFaqs([...faqs, faqToAdd]);
    faqFormRef.current.reset();
    alert('FAQ added successfully!');
  };
  

  const deleteBlog = (id) => {
    setBlogs(blogs.filter(blog => blog.id !== id));
  };
  
  const deleteTestimonial = (id) => {
    setTestimonials(testimonials.filter(testimonial => testimonial.id !== id));
  };
  
  const deletePromotion = (id) => {
    setPromotions(promotions.filter(promotion => promotion.id !== id));
  };
  
  const deleteFaq = (id) => {
    setFaqs(faqs.filter(faq => faq.id !== id));
  };
  
  
  const Navigation = () => (
    <div className="bg-gray-100 p-4 mb-6 rounded-lg">
      <ul className="flex space-x-4">
        <li>
          <button
            className={`px-4 py-2 rounded-md ${activeSection === 'blogs' ? 'bg-green-900 text-white' : 'bg-white'}`}
            onClick={() => setActiveSection('blogs')}
          >
            Blogs
          </button>
        </li>
        <li>
          <button
            className={`px-4 py-2 rounded-md ${activeSection === 'testimonials' ? 'bg-green-900 text-white' : 'bg-white'}`}
            onClick={() => setActiveSection('testimonials')}
          >
            Testimonials
          </button>
        </li>
        <li>
          <button
            className={`px-4 py-2 rounded-md ${activeSection === 'promotions' ? 'bg-green-900 text-white' : 'bg-white'}`}
            onClick={() => setActiveSection('promotions')}
          >
            Promotions
          </button>
        </li>
        <li>
          <button
            className={`px-4 py-2 rounded-md ${activeSection === 'faqs' ? 'bg-green-900 text-white' : 'bg-white'}`}
            onClick={() => setActiveSection('faqs')}
          >
            FAQs
          </button>
        </li>
      </ul>
    </div>
  );
  
  
  const BlogsSection = () => (
    <div>
      <h2 className="text-2xl font-bold mb-4">Blog Management</h2>
      
      
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <h3 className="text-xl font-semibold mb-4">Add New Blog Post</h3>
        <form ref={blogFormRef} onSubmit={handleBlogSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Title</label>
            <input
              type="text"
              name="title"
              className="w-full p-2 border rounded-md"
              required
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Content</label>
            <textarea
              name="content"
              className="w-full p-2 border rounded-md h-32"
              required
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Author</label>
            <input
              type="text"
              name="author"
              className="w-full p-2 border rounded-md"
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Image URL</label>
            <input
              type="text"
              name="imageUrl"
              className="w-full p-2 border rounded-md"
            />
          </div>
          
          <button
            type="submit"
            className="bg-green-900 text-white px-4 py-2 rounded-md hover:bg-green-900"
          >
            Add Blog Post
          </button>
        </form>
      </div>
      
     
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-semibold mb-4">Existing Blog Posts</h3>
        {blogs.length === 0 ? (
          <p className="text-gray-500">No blog posts yet.</p>
        ) : (
          <ul className="divide-y divide-gray-200">
            {blogs.map(blog => (
              <li key={blog.id} className="py-4">
                <div className="flex justify-between">
                  <div>
                    <h4 className="font-medium">{blog.title}</h4>
                    <p className="text-gray-500">By {blog.author}</p>
                  </div>
                  <div>
                    <button
                      onClick={() => deleteBlog(blog.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
  
  const TestimonialsSection = () => (
    <div>
      <h2 className="text-2xl font-bold mb-4">Testimonial Management</h2>
      
      
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <h3 className="text-xl font-semibold mb-4">Add New Testimonial</h3>
        <form ref={testimonialFormRef} onSubmit={handleTestimonialSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Name</label>
            <input
              type="text"
              name="name"
              className="w-full p-2 border rounded-md"
              required
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Company</label>
            <input
              type="text"
              name="company"
              className="w-full p-2 border rounded-md"
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Testimonial</label>
            <textarea
              name="content"
              className="w-full p-2 border rounded-md h-32"
              required
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Rating (1-5)</label>
            <select
              name="rating"
              defaultValue="5"
              className="w-full p-2 border rounded-md"
            >
              {[1, 2, 3, 4, 5].map(num => (
                <option key={num} value={num}>{num}</option>
              ))}
            </select>
          </div>
          
          <button
            type="submit"
            className="bg-green-900 text-white px-4 py-2 rounded-md hover:bg-green-900"
          >
            Add Testimonial
          </button>
        </form>
      </div>
      
     
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-semibold mb-4">Existing Testimonials</h3>
        {testimonials.length === 0 ? (
          <p className="text-gray-500">No testimonials yet.</p>
        ) : (
          <ul className="divide-y divide-gray-200">
            {testimonials.map(testimonial => (
              <li key={testimonial.id} className="py-4">
                <div className="flex justify-between">
                  <div>
                    <h4 className="font-medium">{testimonial.name}</h4>
                    <p className="text-gray-500">{testimonial.company}</p>
                    <p className="mt-1">"{testimonial.content}"</p>
                    <div className="mt-1 flex">
                      {Array.from({ length: testimonial.rating }).map((_, i) => (
                        <span key={i} className="text-yellow-400">★</span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <button
                      onClick={() => deleteTestimonial(testimonial.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
  
  const PromotionsSection = () => (
    <div>
      <h2 className="text-2xl font-bold mb-4">Promotion Management</h2>
      
      
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <h3 className="text-xl font-semibold mb-4">Add New Promotion</h3>
        <form ref={promotionFormRef} onSubmit={handlePromotionSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Title</label>
            <input
              type="text"
              name="title"
              className="w-full p-2 border rounded-md"
              required
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Description</label>
            <textarea
              name="description"
              className="w-full p-2 border rounded-md h-24"
              required
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Discount</label>
            <input
              type="text"
              name="discount"
              className="w-full p-2 border rounded-md"
              placeholder="e.g., 20% OFF, $50 OFF, etc."
              required
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Valid Until</label>
            <input
              type="date"
              name="validUntil"
              className="w-full p-2 border rounded-md"
              required
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Image URL</label>
            <input
              type="text"
              name="imageUrl"
              className="w-full p-2 border rounded-md"
            />
          </div>
          
          <button
            type="submit"
            className="bg-green-900 text-white px-4 py-2 rounded-md hover:bg-green-900"
          >
            Add Promotion
          </button>
        </form>
      </div>
      
      
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-semibold mb-4">Active Promotions</h3>
        {promotions.length === 0 ? (
          <p className="text-gray-500">No active promotions.</p>
        ) : (
          <ul className="divide-y divide-gray-200">
            {promotions.map(promotion => (
              <li key={promotion.id} className="py-4">
                <div className="flex justify-between">
                  <div>
                    <h4 className="font-medium">{promotion.title}</h4>
                    <p className="text-green-600 font-bold">{promotion.discount}</p>
                    <p className="mt-1">{promotion.description}</p>
                    <p className="text-gray-500 text-sm mt-1">Valid until: {promotion.validUntil}</p>
                  </div>
                  <div>
                    <button
                      onClick={() => deletePromotion(promotion.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
  
  const FaqsSection = () => (
    <div>
      <h2 className="text-2xl font-bold mb-4">FAQ Management</h2>
      
      
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <h3 className="text-xl font-semibold mb-4">Add New FAQ</h3>
        <form ref={faqFormRef} onSubmit={handleFaqSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Question</label>
            <input
              type="text"
              name="question"
              className="w-full p-2 border rounded-md"
              required
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Answer</label>
            <textarea
              name="answer"
              className="w-full p-2 border rounded-md h-32"
              required
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Category</label>
            <select
              name="category"
              className="w-full p-2 border rounded-md"
              required
            >
              <option value="">Select a category</option>
              <option value="general">General</option>
              <option value="services">services</option>
              <option value="refund">refund & Refunds</option>
              <option value="account">Account & Login</option>
            </select>
          </div>
          
          <button
            type="submit"
            className="bg-green-900 text-white px-4 py-2 rounded-md hover:bg-green-900"
          >
            Add FAQ
          </button>
        </form>
      </div>
      
    
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-semibold mb-4">Existing FAQs</h3>
        {faqs.length === 0 ? (
          <p className="text-gray-500">No FAQs yet.</p>
        ) : (
          <div>
           
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Filter by Category</label>
              <select
                className="w-full p-2 border rounded-md"
              >
                <option value="">All Categories</option>
                <option value="general">General</option>
                <option value="services">services</option>
                <option value="refund">Refund</option>
                <option value="account">Account & Login</option>
              </select>
            </div>
            
            <ul className="divide-y divide-gray-200">
              {faqs.map(faq => (
                <li key={faq.id} className="py-4">
                  <div className="flex justify-between">
                    <div>
                      <h4 className="font-medium">{faq.question}</h4>
                      <p className="text-gray-500 text-sm mt-1">Category: {faq.category}</p>
                      <p className="mt-2">{faq.answer}</p>
                    </div>
                    <div>
                      <button
                        onClick={() => deleteFaq(faq.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
  
  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <h1 className="text-3xl font-bold mb-6">Content Management System</h1>
      
      <Navigation />
      
      {activeSection === 'blogs' && <BlogsSection />}
      {activeSection === 'testimonials' && <TestimonialsSection />}
      {activeSection === 'promotions' && <PromotionsSection />}
      {activeSection === 'faqs' && <FaqsSection />}
    </div>
  );
};

export default ContentManagement;