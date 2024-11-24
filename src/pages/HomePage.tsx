import { Link } from 'react-router-dom';
import { MessageSquare, Video, Shield, Zap, Users, Globe, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '../lib/utils';

const features = [
  {
    icon: MessageSquare,
    color: 'blue',
    title: 'Real-time Messaging',
    description: 'Send and receive messages instantly with real-time delivery and read receipts.'
  },
  {
    icon: Video,
    color: 'green',
    title: 'HD Video Calls',
    description: 'Crystal clear video calls with screen sharing and virtual backgrounds.'
  },
  {
    icon: Shield,
    color: 'purple',
    title: 'End-to-End Encryption',
    description: 'Your conversations are always secure with end-to-end encryption.'
  },
  {
    icon: Users,
    color: 'pink',
    title: 'Group Chats',
    description: 'Create groups for team collaboration or friend circles.'
  },
  {
    icon: Globe,
    color: 'orange',
    title: 'Global Reach',
    description: 'Connect with people from anywhere in the world instantly.'
  }
];

const HomePage = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* New Hero Section */}
      <section className="relative overflow-hidden bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="relative z-10 pb-8 bg-white sm:pb-16 md:pb-20 lg:pb-28 xl:pb-32">
            <div className="relative pt-6 px-4 sm:px-6 lg:px-8">
              <div className="mt-16 mx-auto max-w-7xl px-4 sm:mt-24 sm:px-6">
                <div className="text-center">
                  <motion.h1 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl"
                  >
                    <span className="block">Communication made</span>
                    <span className="block text-primary-light">simple and secure</span>
                  </motion.h1>
                  <motion.p 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl"
                  >
                    Connect with friends, family, and colleagues instantly. Send messages, make video calls, and share moments with the people who matter most.
                  </motion.p>
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8"
                  >
                    <div className="rounded-md shadow">
                      <Link
                        to="/signup"
                        className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary-light hover:bg-primary md:py-4 md:text-lg md:px-10"
                      >
                        Get started
                        <ArrowRight className="ml-2 -mr-1 w-5 h-5" />
                      </Link>
                    </div>
                    <div className="mt-3 sm:mt-0 sm:ml-3">
                      <Link
                        to="/about"
                        className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-primary-light bg-primary-light/10 hover:bg-primary-light hover:text-white md:py-4 md:text-lg md:px-10"
                      >
                        Learn more
                      </Link>
                    </div>
                  </motion.div>
                </div>
              </div>
            </div>

            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="relative"
            >
              <div className="absolute inset-0 flex flex-col" aria-hidden="true">
                <div className="flex-1" />
                <div className="flex-1 w-full bg-gray-50" />
              </div>
              <div className="max-w-7xl mx-auto px-4 sm:px-6 mt-10">
                <img
                  className="relative rounded-lg shadow-xl ring-1 ring-black ring-opacity-5"
                  src="/bg-hero.png"
                  alt="App screenshot"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-3xl font-bold text-gray-900 sm:text-4xl"
            >
              Everything you need to stay connected
            </motion.h2>
            <p className="mt-4 text-xl text-gray-600">
              Powerful features designed for seamless communication
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="relative p-8 bg-white rounded-2xl shadow-sm hover:shadow-lg transition-shadow"
              >
                <div className={cn(
                  "w-16 h-16 mx-auto mb-6 rounded-2xl flex items-center justify-center",
                  `bg-${feature.color}-100`
                )}>
                  <feature.icon className={cn("w-8 h-8", `text-${feature.color}-600`)} />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary-light py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-3xl font-bold text-white mb-8"
            >
              Ready to get started?
            </motion.h2>
            <Link
              to="/signup"
              className="inline-flex items-center justify-center px-8 py-3 text-base font-medium text-primary-light bg-white hover:bg-blue-50 rounded-full transition-colors duration-200"
            >
              Create Free Account
              <Zap className="ml-2 w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;