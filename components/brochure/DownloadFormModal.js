'use client';

import { useState } from 'react';
import { X, Loader2, CheckCircle, XCircle } from 'lucide-react';

function isEmailFormat(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/**
 * Download Form Modal
 * Captures user information before PDF download
 */
export default function DownloadFormModal({ isOpen, onClose, onSubmit }) {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    hotelName: '',
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [emailStatus, setEmailStatus] = useState(null); // null | 'checking' | 'valid' | 'invalid'
  const [emailError, setEmailError] = useState('');

  const verifyEmail = async (email) => {
    if (!isEmailFormat(email)) {
      setEmailStatus('invalid');
      setEmailError('Please enter a valid email address.');
      return false;
    }
    setEmailStatus('checking');
    setEmailError('');
    try {
      const res = await fetch('/api/verify-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (data.valid) {
        setEmailStatus('valid');
        return true;
      } else {
        setEmailStatus('invalid');
        setEmailError(data.reason || 'Please enter a valid email address.');
        return false;
      }
    } catch {
      setEmailStatus(null);
      return true;
    }
  };

  const handleEmailBlur = async () => {
    if (!formData.email) return;
    await verifyEmail(formData.email);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
    if (name === 'email') {
      setEmailStatus(null);
      setEmailError('');
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!formData.hotelName.trim()) {
      newErrors.hotelName = 'Hotel name is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    // Verify email before submission
    if (emailStatus !== 'valid') {
      const ok = await verifyEmail(formData.email);
      if (!ok) return;
    }

    setIsSubmitting(true);

    try {
      // Call the onSubmit callback with form data
      await onSubmit(formData);

      // Reset form
      setFormData({
        fullName: '',
        email: '',
        hotelName: '',
      });
      setErrors({});
    } catch (error) {
      console.error('Form submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-charcoal-900 rounded-2xl shadow-2xl max-w-md w-full border border-charcoal-700">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
          aria-label="Close modal"
        >
          <X size={24} />
        </button>

        {/* Modal Content */}
        <div className="p-8">
          <h2 className="text-3xl font-outfit font-bold text-white mb-2">
            Download Brochure
          </h2>
          <p className="text-gray-400 font-inter mb-6">
            Please provide your details to receive the RoomService AI brochure
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name */}
            <div>
              <label
                htmlFor="fullName"
                className="block text-sm font-inter font-medium text-gray-300 mb-2"
              >
                Full Name *
              </label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                className={`w-full px-4 py-3 rounded-xl bg-charcoal-800 border ${
                  errors.fullName ? 'border-red-500' : 'border-charcoal-700'
                } text-white font-inter focus:outline-none focus:ring-2 focus:ring-copper-500 transition-all`}
                placeholder="John Smith"
              />
              {errors.fullName && (
                <p className="mt-1 text-sm text-red-500 font-inter">{errors.fullName}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-inter font-medium text-gray-300 mb-2"
              >
                Email Address *
              </label>
              <div className="relative">
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  onBlur={handleEmailBlur}
                  className={`w-full px-4 py-3 pr-10 rounded-xl bg-charcoal-800 border text-white font-inter focus:outline-none focus:ring-2 transition-all
                    ${errors.email || emailStatus === 'invalid'
                      ? 'border-red-500 focus:ring-red-500/40'
                      : emailStatus === 'valid'
                      ? 'border-green-500 focus:ring-green-500/40'
                      : 'border-charcoal-700 focus:ring-copper-500'
                    }`}
                  placeholder="john@hotel.com"
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  {emailStatus === 'checking' && <Loader2 size={16} className="text-copper animate-spin" />}
                  {emailStatus === 'valid' && <CheckCircle size={16} className="text-green-400" />}
                  {emailStatus === 'invalid' && <XCircle size={16} className="text-red-400" />}
                </div>
              </div>
              {(errors.email || (emailStatus === 'invalid' && emailError)) && (
                <p className="mt-1 text-sm text-red-500 font-inter">
                  {errors.email || emailError}
                </p>
              )}
            </div>

            {/* Hotel Name */}
            <div>
              <label
                htmlFor="hotelName"
                className="block text-sm font-inter font-medium text-gray-300 mb-2"
              >
                Hotel Name *
              </label>
              <input
                type="text"
                id="hotelName"
                name="hotelName"
                value={formData.hotelName}
                onChange={handleChange}
                className={`w-full px-4 py-3 rounded-xl bg-charcoal-800 border ${
                  errors.hotelName ? 'border-red-500' : 'border-charcoal-700'
                } text-white font-inter focus:outline-none focus:ring-2 focus:ring-copper-500 transition-all`}
                placeholder="Grand Hotel"
              />
              {errors.hotelName && (
                <p className="mt-1 text-sm text-red-500 font-inter">{errors.hotelName}</p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting || emailStatus === 'checking'}
              className="w-full px-6 py-4 rounded-xl bg-gradient-to-r from-copper-500 to-copper-600
                       text-white font-outfit font-bold text-lg
                       hover:from-copper-600 hover:to-copper-700
                       disabled:opacity-50 disabled:cursor-not-allowed
                       transition-all duration-300 hover:shadow-lg hover:shadow-copper-500/30"
            >
              {isSubmitting
                ? 'Processing...'
                : emailStatus === 'checking'
                ? 'Verifying email…'
                : 'Download Brochure'}
            </button>
          </form>

          <p className="mt-4 text-xs text-gray-500 font-inter text-center">
            We respect your privacy. Your information will only be used to send you the brochure.
          </p>
        </div>
      </div>
    </div>
  );
}
