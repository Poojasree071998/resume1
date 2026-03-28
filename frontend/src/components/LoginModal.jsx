import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, User, Lock, Mail, ChevronRight, Eye, EyeOff } from 'lucide-react';

const LoginModal = ({ isOpen, onClose, onLogin, error }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    username: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simulate login
    onLogin(formData);
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="central-glow"></div>
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="login-modal-glass"
      >
        <button className="close-btn" onClick={onClose} aria-label="Close modal">
          <X size={20} />
        </button>

        <div className="login-header">
          <div className="user-icon-hollow">
            <User size={48} strokeWidth={1} />
          </div>
          <h2>{isLogin ? 'Sign In' : 'Sign Up'}</h2>
          {error && (
            <motion.p 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              style={{ color: '#ef4444', fontSize: '0.9rem', fontWeight: 600, marginTop: '1rem' }}
            >
              {error}
            </motion.p>
          )}
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="input-group-glass">
            <div className="input-icon">
              <User size={22} strokeWidth={1.5} />
            </div>
            <input 
              type="text" 
              placeholder={isLogin ? "Username" : "Email"} 
              value={isLogin ? formData.username : formData.email}
              onChange={(e) => setFormData({ ...formData, [isLogin ? 'username' : 'email']: e.target.value })}
              required 
            />
          </div>

          <div className="input-group-glass">
            <div className="input-icon">
              <Lock size={22} strokeWidth={1.5} />
            </div>
            <input 
              type={showPassword ? "text" : "password"} 
              placeholder="Password" 
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required 
            />
            {showPassword && (
              <button 
                type="button" 
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
              >
                <EyeOff size={16} />
              </button>
            )}
          </div>

          <button type="submit" className="login-submit-btn">
            {isLogin ? 'LOGIN' : 'SIGN UP'}
          </button>

          <div className="form-options">
            <label className="remember-me">
              <input type="checkbox" />
              <span>Remember me</span>
            </label>
            <a href="#" className="forgot-link">Forgot password?</a>
          </div>
        </form>

        <div className="login-footer">
          <div className="divider"></div>
          <p className="footer-link-row">
            {isLogin ? "Don't have an account ?" : "Already have an account ?"}{' '}
            <button type="button" onClick={() => setIsLogin(!isLogin)} className="register-link-btn">
              {isLogin ? 'REGISTER HERE' : 'LOGIN HERE'}
            </button>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginModal;
