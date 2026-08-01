import React, { useState, useMemo } from 'react';
import { blogs, type BlogItem } from '../data/generatedContent';
import { Search, Heart, Clock, User, Calendar, X, ArrowUpDown } from 'lucide-react';
import { AdSenseUnit } from './AdSenseUnit';

export const BlogSection: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState<'date' | 'likes'>('date');
  const [activeBlog, setActiveBlog] = useState<BlogItem | null>(null);
  const [visibleCount, setVisibleCount] = useState(12);

  // Categories
  const categories = useMemo(() => {
    const list = new Set(blogs.map(b => b.category));
    return ['All', ...Array.from(list)];
  }, []);

  // Filter & Sort
  const filteredBlogs = useMemo(() => {
    let result = blogs.filter(blog => {
      const matchesSearch = blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            blog.summary.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || blog.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });

    if (sortBy === 'likes') {
      result.sort((a, b) => b.likes - a.likes);
    } else {
      // Sort by date (mock strings converted to date indices)
      result.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }
    return result;
  }, [searchTerm, selectedCategory, sortBy]);

  const displayedBlogs = filteredBlogs.slice(0, visibleCount);

  const combinedList = useMemo(() => {
    const list = [];
    let blogPointer = 0;
    for (let i = 0; blogPointer < displayedBlogs.length; i++) {
      if (i % 2 === 0) {
        list.push({ type: 'blog', data: displayedBlogs[blogPointer], id: displayedBlogs[blogPointer].id });
        blogPointer++;
      } else {
        list.push({ type: 'ad', id: `grid-ad-${i}` });
      }
    }
    return list;
  }, [displayedBlogs]);

  return (
    <div className="blog-section">
      <div className="section-header">
        <h2 className="font-display section-title">CHRONICLES & <span className="gradient-text-cyber">LOGS</span></h2>
        <p className="section-desc">Access 40 encrypted blog logs from the deep cybernetic networks.</p>
      </div>

      {/* Filters Toolbar */}
      <div className="toolbar glass-panel">
        <div className="search-box">
          <Search size={18} className="search-icon" />
          <input 
            type="text" 
            placeholder="Search records..." 
            value={searchTerm} 
            onChange={(e) => setSearchTerm(e.target.value)} 
          />
        </div>

        <div className="filter-actions">
          <select 
            value={selectedCategory} 
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="category-select"
          >
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>

          <button 
            className="sort-btn font-mono"
            onClick={() => setSortBy(prev => prev === 'date' ? 'likes' : 'date')}
          >
            <ArrowUpDown size={14} />
            Sort: {sortBy === 'date' ? 'Newest' : 'Popularity'}
          </button>
        </div>
      </div>

      {/* Grid */}
      <div className="blog-grid">
        {combinedList.map((item, idx) => {
          if (item.type === 'blog' && item.data) {
            const blog = item.data;
            return (
              <div 
                key={blog.id} 
                className="blog-card glass-panel-glow" 
                onClick={() => setActiveBlog(blog)}
                style={{ animationDelay: `${idx * 0.05}s` }}
              >
                <div className="card-image-wrapper">
                  <img src={blog.coverImage} alt={blog.title} className="card-image" />
                  <span className="card-category font-mono">{blog.category}</span>
                </div>
                <div className="card-body">
                  <div className="card-meta font-mono">
                    <span><Clock size={12} /> {blog.readTime}</span>
                    <span><Heart size={12} /> {blog.likes}</span>
                  </div>
                  <h3 className="card-title font-display">{blog.title}</h3>
                  <p className="card-summary">{blog.summary}</p>
                  <div className="card-footer">
                    <span className="card-author font-mono">//{blog.author}</span>
                    <span className="card-date">{blog.date}</span>
                  </div>
                </div>
              </div>
            );
          } else {
            return (
              <div 
                key={item.id}
                className="blog-card glass-panel-glow ad-card" 
                style={{ 
                  gridColumn: 'span 1', 
                  display: 'flex', 
                  flexDirection: 'column', 
                  justifyContent: 'center', 
                  minHeight: '350px',
                  padding: '1rem',
                  animationDelay: `${idx * 0.05}s`
                }}
              >
                <AdSenseUnit slot={item.id} format="rectangle" />
              </div>
            );
          }
        })}
      </div>

      {/* Load More */}
      {visibleCount < filteredBlogs.length && (
        <div className="load-more-container">
          <button className="neon-btn" onClick={() => setVisibleCount(prev => prev + 12)}>
            Load More Archives
          </button>
        </div>
      )}

      {/* Read Modal */}
      {activeBlog && (
        <div className="modal-overlay" onClick={() => setActiveBlog(null)}>
          <div className="modal-content glass-panel-glow" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setActiveBlog(null)}>
              <X size={24} />
            </button>
            <div className="modal-header">
              <div className="modal-meta font-mono">
                <span className="modal-cat">{activeBlog.category}</span>
                <span><User size={14} /> {activeBlog.author}</span>
                <span><Calendar size={14} /> {activeBlog.date}</span>
                <span><Clock size={14} /> {activeBlog.readTime}</span>
              </div>
              <h1 className="modal-title font-display">{activeBlog.title}</h1>
            </div>
            <div className="modal-image-wrapper">
              <img src={activeBlog.coverImage} alt={activeBlog.title} className="modal-image" />
            </div>
            <div 
              className="modal-body-content"
              dangerouslySetInnerHTML={{ __html: activeBlog.content }}
            />
            <div className="modal-footer">
              <button className="like-button font-mono">
                <Heart size={18} fill="currentColor" /> {activeBlog.likes + 1} Likes
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .blog-section {
          padding: 2rem 5%;
          max-width: 1400px;
          margin: 0 auto;
        }
        .section-header {
          text-align: center;
          margin-bottom: 3rem;
        }
        .section-title {
          font-size: 2.5rem;
          margin-bottom: 0.5rem;
        }
        .section-desc {
          color: var(--text-secondary);
        }
        .toolbar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 1.5rem;
          padding: 1rem 2rem;
          margin-bottom: 3rem;
          flex-wrap: wrap;
        }
        .search-box {
          display: flex;
          align-items: center;
          background: rgba(0, 0, 0, 0.4);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 8px;
          padding: 0 1rem;
          flex: 1;
          min-width: 250px;
        }
        .search-icon {
          color: var(--text-muted);
          margin-right: 0.5rem;
        }
        .search-box input {
          border: none;
          background: transparent;
          width: 100%;
          padding: 0.8rem 0;
        }
        .search-box input:focus {
          box-shadow: none;
        }
        .filter-actions {
          display: flex;
          gap: 1rem;
          align-items: center;
        }
        .category-select {
          background: rgba(0, 0, 0, 0.4);
          border: 1px solid rgba(255, 255, 255, 0.08);
          color: var(--text-primary);
        }
        .sort-btn {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          background: rgba(0, 242, 254, 0.05);
          border: 1px solid rgba(0, 242, 254, 0.15);
          color: var(--neon-cyan);
          padding: 0.75rem 1.2rem;
          border-radius: 8px;
          cursor: pointer;
          font-weight: 700;
          transition: all 0.3s;
        }
        .sort-btn:hover {
          background: rgba(0, 242, 254, 0.15);
          box-shadow: var(--shadow-cyan);
        }
        .blog-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 2rem;
        }
        @media (max-width: 1024px) {
          .blog-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }
        @media (max-width: 640px) {
          .blog-grid {
            grid-template-columns: 1fr;
          }
        }
        .blog-card {
          cursor: pointer;
          display: flex;
          flex-direction: column;
          overflow: hidden;
          transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
          opacity: 0;
          transform: translateY(20px);
          animation: cardAppear 0.5s forwards;
        }
        @keyframes cardAppear {
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .blog-card:hover {
          transform: translateY(-8px);
          border-color: var(--neon-cyan);
          box-shadow: 0 12px 30px rgba(0, 242, 254, 0.15);
        }
        .card-image-wrapper {
          position: relative;
          height: 200px;
          overflow: hidden;
        }
        .card-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.6s ease;
        }
        .blog-card:hover .card-image {
          transform: scale(1.05);
        }
        .card-category {
          position: absolute;
          top: 1rem;
          right: 1rem;
          background: rgba(0, 0, 0, 0.75);
          border: 1px solid var(--neon-cyan);
          color: var(--neon-cyan);
          padding: 0.3rem 0.6rem;
          border-radius: 4px;
          font-size: 0.75rem;
          text-transform: uppercase;
        }
        .card-body {
          padding: 1.5rem;
          display: flex;
          flex-direction: column;
          flex: 1;
        }
        .card-meta {
          display: flex;
          gap: 1rem;
          font-size: 0.8rem;
          color: var(--text-muted);
          margin-bottom: 0.75rem;
        }
        .card-meta span {
          display: flex;
          align-items: center;
          gap: 0.25rem;
        }
        .card-title {
          font-size: 1.25rem;
          margin-bottom: 0.75rem;
          line-height: 1.3;
          color: var(--text-primary);
        }
        .card-summary {
          color: var(--text-secondary);
          font-size: 0.95rem;
          line-height: 1.5;
          margin-bottom: 1.5rem;
          flex: 1;
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .card-footer {
          display: flex;
          justify-content: space-between;
          font-size: 0.8rem;
          color: var(--text-muted);
          border-top: 1px solid rgba(255, 255, 255, 0.05);
          padding-top: 1rem;
        }
        .card-author {
          color: var(--neon-purple);
        }
        .load-more-container {
          display: flex;
          justify-content: center;
          margin-top: 4rem;
        }

        /* Modal styling */
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.85);
          backdrop-filter: blur(8px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          padding: 2rem;
        }
        .modal-content {
          width: 100%;
          max-width: 900px;
          max-height: 90vh;
          overflow-y: auto;
          position: relative;
          padding: 3rem;
          border-radius: 20px;
        }
        .modal-close {
          position: absolute;
          top: 1.5rem;
          right: 1.5rem;
          background: transparent;
          border: none;
          color: var(--text-secondary);
          cursor: pointer;
          transition: color 0.3s;
        }
        .modal-close:hover {
          color: var(--neon-magenta);
        }
        .modal-meta {
          display: flex;
          flex-wrap: wrap;
          gap: 1.5rem;
          color: var(--text-secondary);
          font-size: 0.9rem;
          margin-bottom: 1rem;
        }
        .modal-meta span {
          display: flex;
          align-items: center;
          gap: 0.4rem;
        }
        .modal-cat {
          color: var(--neon-cyan);
          border: 1px solid rgba(0, 242, 254, 0.3);
          background: rgba(0, 242, 254, 0.05);
          padding: 0.2rem 0.6rem;
          border-radius: 4px;
        }
        .modal-title {
          font-size: 2.5rem;
          line-height: 1.2;
          margin-bottom: 2rem;
        }
        .modal-image-wrapper {
          width: 100%;
          border-radius: 12px;
          overflow: hidden;
          margin-bottom: 2.5rem;
          border: 1px solid rgba(255, 255, 255, 0.08);
        }
        .modal-image {
          width: 100%;
          max-height: 400px;
          object-fit: cover;
        }
        .modal-body-content {
          font-size: 1.15rem;
          line-height: 1.7;
          color: var(--text-primary);
        }
        .modal-body-content p {
          margin-bottom: 1.5rem;
        }
        .modal-body-content h3 {
          font-family: var(--font-display);
          color: var(--neon-cyan);
          margin: 2rem 0 1rem;
        }
        .modal-body-content blockquote {
          border-left: 4px solid var(--neon-purple);
          padding-left: 1.5rem;
          margin: 2rem 0;
          font-style: italic;
          color: var(--text-secondary);
        }
        .modal-body-content ul {
          margin-bottom: 1.5rem;
          padding-left: 1.5rem;
        }
        .modal-body-content li {
          margin-bottom: 0.5rem;
        }
        .modal-footer {
          margin-top: 3rem;
          border-top: 1px solid rgba(255, 255, 255, 0.08);
          padding-top: 2rem;
        }
        .like-button {
          background: rgba(255, 0, 127, 0.1);
          border: 1px solid rgba(255, 0, 127, 0.3);
          color: var(--neon-magenta);
          padding: 0.75rem 1.5rem;
          border-radius: 8px;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-weight: 700;
          transition: all 0.3s;
        }
        .like-button:hover {
          background: var(--neon-magenta);
          color: #fff;
          box-shadow: 0 0 15px rgba(255, 0, 127, 0.3);
        }
        @media (max-width: 768px) {
          .toolbar {
            padding: 1rem;
          }
          .modal-content {
            padding: 1.5rem;
          }
          .modal-title {
            font-size: 1.8rem;
          }
        }
      `}</style>
    </div>
  );
};
