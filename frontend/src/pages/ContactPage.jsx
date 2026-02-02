import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { Mail, Phone, MapPin } from 'lucide-react';

const ContactPage = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      toast({
        title: "Incomplete Form",
        description: "Please fill out all fields before submitting.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Message Sent!",
      description: "Thanks for reaching out! We'll get back to you soon.",
    });
    setFormData({ name: '', email: '', message: '' });
  };

  const contactInfo = [
    {
      icon: Mail,
      title: "Email Us",
      content: "campussbuzz80@gmail.com",
      href: "mailto:campussbuzz80@gmail.com",
    },
    {
      icon: Phone,
      title: "Call Us",
      content: "+91 6352722836",
      href: "tel:+6352722836",
    },
    {
      icon: MapPin,
      title: "Find Us",
      content: "SSASIT, Surat, Gujarat, India",
      href: "https://www.google.com/maps/place/SSASIT/data=!4m2!3m1!1s0x0:0x116fcdb2bd69883d?sa=X&ved=1t:2428&ictx=111",
    },
  ];

  return (
    <>
      <Helmet>
        <title>Contact Us - CampusBuzz</title>
        <meta name="description" content="Get in touch with the CampusBuzz team. We're here to help with any questions or feedback." />
      </Helmet>
      <div className="bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h1 className="text-5xl md:text-6xl font-bold mb-4 gradient-text">
              Get In Touch
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Have questions, feedback, or need support? We'd love to hear from you.
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <Card className="glass-effect border-0 shadow-lg p-4 sm:p-8">
                <CardHeader>
                  <CardTitle className="text-3xl">Send us a Message</CardTitle>
                  <CardDescription>
                    Fill out the form and our team will get back to you shortly.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700">Full Name</label>
                      <Input
                        id="name"
                        type="text"
                        placeholder="John Doe"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="mt-1 bg-white/70"
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Address</label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="you@example.com"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="mt-1 bg-white/70"
                      />
                    </div>
                    <div>
                      <label htmlFor="message" className="block text-sm font-medium text-gray-700">Message</label>
                      <textarea
                        id="message"
                        rows="5"
                        placeholder="Your message here..."
                        value={formData.message}
                        onChange={handleInputChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 sm:text-sm bg-white/70 p-2"
                      ></textarea>
                    </div>
                    <Button
                      type="submit"
                      className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white py-3"
                      size="lg"
                    >
                      Send Message
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </motion.div>

            {/* Contact Info */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="space-y-8"
            >
              {contactInfo.map((info, index) => (
                <div key={index} className="flex items-start space-x-6">
                  <div className="flex-shrink-0">
                    <div className="p-4 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full w-fit">
                      <info.icon className="h-8 w-8 text-white" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-2xl font-semibold text-gray-800">{info.title}</h3>
                    <a
                      href={info.href}
                      className="text-lg text-purple-600 hover:underline"
                      onClick={(e) => {
                        if (info.href === "#") {
                          e.preventDefault();
                          toast({ title: "🚧 This feature isn't implemented yet—but don't worry! You can request it in your next prompt! 🚀" });
                        }
                      }}
                    >
                      {info.content}
                    </a>
                  </div>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ContactPage;
