import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Send } from 'lucide-react';

const ContactPage = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="pt-20 pb-16 sm:pt-32 sm:pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-extrabold text-gray-900 sm:text-5xl md:text-6xl"
          >
            Get  <span className="text-primary-light ">in Touch</span> 
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mt-6 text-xl text-gray-600 max-w-3xl mx-auto"
          >
            We'd love to hear from you. Our team is always here to help.
          </motion.p>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* Contact Information */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-8"
            >
              <h2 className="text-3xl font-bold text-gray-900">Contact Information</h2>
              <p className="text-lg text-gray-600">
                Fill out the form and we'll get back to you within 24 hours.
              </p>

              <div className="space-y-6">
                {[
                  {
                    icon: Mail,
                    title: 'Email',
                    content: 'contact@chatapp.com'
                  },
                  {
                    icon: Phone,
                    title: 'Phone',
                    content: '+1 (555) 123-4567'
                  },
                  {
                    icon: MapPin,
                    title: 'Address',
                    content: '123 Chat Street, San Francisco, CA 94105'
                  }
                ].map((item) => (
                  <div key={item.title} className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-primary-light/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <item.icon className="w-6 h-6 text-primary-light" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{item.title}</h3>
                      <p className="text-gray-600">{item.content}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-2xl shadow-sm p-8 border border-gray-200"
            >
              <form className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    className="mt-1 py-4 block w-full rounded-lg border border-gray-300 shadow-sm focus:border-primary-light focus:ring-primary-light"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    className="mt-1  py-4 block w-full rounded-lg border border-gray-300 shadow-sm focus:border-primary-light focus:ring-primary-light"
                  />
                </div>
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700">
                    Message
                  </label>
                  <textarea
                    id="message"
                    rows={4}
                    className="mt-1 block w-full rounded-lg border border-gray-300 shadow-sm focus:border-primary-light focus:ring-primary-light"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full flex justify-center items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-primary-light hover:bg-primary"
                >
                  Send Message
                  <Send className="ml-2 w-5 h-5" />
                </button>
              </form>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactPage;