import React, { useState } from 'react';
import axios from 'axios';
import { Helmet } from 'react-helmet-async';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { Mail, Phone, MapPin } from 'lucide-react';
import { motion } from 'framer-motion';
import Typewriter from '@/components/ui/Typewriter';
import Reveal from '@/components/ui/Reveal';

const ContactPage = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      toast({
        title: "Incomplete Form",
        description: "Please fill out all fields before submitting.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/contact`, formData);
      
      if (response.data.success) {
        toast({
          title: "Message Sent!",
          description: "Thanks for reaching out! We've received your message and will get back to you soon.",
        });
        setFormData({ name: '', email: '', message: '' });
      }
    } catch (error) {
      console.error("Submission error:", error);
      toast({
        title: "Submission Failed",
        description: error.response?.data?.message || "There was an error sending your message. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
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
      <div className="bg-transparent py-20 px-4 min-h-screen transition-colors duration-300">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-24">
            <Reveal width="100%">
              <h1 className="text-5xl md:text-7xl font-black mb-6 text-slate-900 tracking-tight leading-tight">
                Get <span className="text-indigo-600">In Touch</span>
              </h1>
            </Reveal>
            <Reveal width="100%" delay={0.3}>
              <p className="text-xl text-slate-500 font-medium max-w-3xl mx-auto leading-relaxed">
                Have questions, feedback, or need support? Our team is ready to assist you.
              </p>
            </Reveal>
          </div>

          <div className="grid lg:grid-cols-2 gap-16 items-start">
            {/* Contact Form */}
            <div>
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
              >
                <Card className="bg-white border-slate-200/60 shadow-2xl shadow-slate-200/20 rounded-[3rem] p-4 sm:p-10 overflow-hidden relative">
                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-bl-full opacity-50" />
                <CardHeader className="relative z-10 px-0 pt-0">
                  <CardTitle className="text-3xl font-black text-slate-900 tracking-tight">Send us a Message</CardTitle>
                  <CardDescription className="text-slate-500 font-medium mt-2">
                    Fill out the form and we'll get back to you within 24 hours.
                  </CardDescription>
                </CardHeader>
                <CardContent className="px-0 pb-0 mt-8 relative z-10">
                  <form onSubmit={handleSubmit} className="space-y-8">
                    <div className="space-y-3">
                      <label htmlFor="name" className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Full Name</label>
                      <Input
                        id="name"
                        type="text"
                        placeholder="John Doe"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="h-14 bg-slate-50 border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-medium"
                      />
                    </div>
                    <div className="space-y-3">
                      <label htmlFor="email" className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Email Address</label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="you@example.com"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="h-14 bg-slate-50 border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-medium"
                      />
                    </div>
                    <div className="space-y-3">
                      <label htmlFor="message" className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Message</label>
                      <textarea
                        id="message"
                        rows="5"
                        placeholder="Your message here..."
                        value={formData.message}
                        onChange={handleInputChange}
                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-medium p-4 focus:outline-none"
                      ></textarea>
                    </div>
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-indigo-600 hover:bg-indigo-700 text-white h-16 rounded-2xl font-black text-lg shadow-xl shadow-indigo-600/20 active:scale-95 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                      size="lg"
                    >
                      {isSubmitting ? (
                        <div className="flex items-center space-x-2">
                          <div className="w-5 h-5 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
                          <span>Sending...</span>
                        </div>
                      ) : (
                        "Send Message"
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
              </motion.div>
            </div>

            {/* Contact Info */}
             <div className="space-y-10 lg:pt-10">
               <div className="flex items-center space-x-3 mb-6 bg-indigo-50 w-fit px-4 py-2 rounded-full border border-indigo-100">
                 <span className="relative flex h-3 w-3">
                   <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                   <span className="relative inline-flex rounded-full h-3 w-3 bg-indigo-600"></span>
                 </span>
                 <span className="text-sm font-black text-indigo-600 uppercase tracking-widest">Live Connectivity</span>
               </div>
               {contactInfo.map((info, index) => (
                 <motion.div 
                   key={index} 
                   initial={{ opacity: 0, x: 50 }}
                   whileInView={{ opacity: 1, x: 0 }}
                   transition={{ duration: 0.5, delay: index * 0.1 }}
                   viewport={{ once: true }}
                   className="group flex items-start space-x-8 p-8 bg-white border border-slate-200/60 rounded-[2.5rem] shadow-xl shadow-slate-200/20 hover:shadow-2xl hover:shadow-indigo-500/10 transition-all duration-500 hover:-translate-y-2"
                 >
                   <div className="flex-shrink-0">
                     <motion.div 
                       whileHover={{ rotate: 15, scale: 1.1 }}
                       className="p-5 bg-indigo-50 rounded-[1.5rem] border border-indigo-100 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-500 shadow-sm"
                     >
                       <info.icon className="h-8 w-8 text-indigo-600 group-hover:text-white transition-colors" />
                     </motion.div>
                   </div>
                   <div>
                     <h3 className="text-2xl font-black text-slate-900 tracking-tight mb-2">{info.title}</h3>
                     <a
                       href={info.href}
                       target={info.title === "Find Us" ? "_blank" : "_self"}
                       rel="noopener noreferrer"
                       className="text-lg text-slate-500 font-bold hover:text-indigo-600 transition-colors inline-block leading-relaxed"
                       onClick={(e) => {
                         if (info.href === "#") {
                           e.preventDefault();
                           toast({ title: "Unavailable", description: "This feature is currently not active in this version." });
                         }
                       }}
                     >
                       <Typewriter text={info.content} delay={index * 400 + 800} speed={40} />
                     </a>
                   </div>
                 </motion.div>
               ))}

              <div className="p-10 bg-indigo-600 rounded-[3rem] text-white shadow-2xl shadow-indigo-600/30 overflow-hidden relative">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 blur-3xl" />
                <h4 className="text-2xl font-black tracking-tight mb-4 relative z-10">Working Hours</h4>
                <p className="text-indigo-100 font-medium leading-relaxed relative z-10">
                  Monday - Friday: 9:00 AM - 6:00 PM<br />
                  Weekend: Closed
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ContactPage;