import React, { useState } from 'react';
import '../styles/Newsletter.css';

function NewsletterPage() {
  const [posts, setPosts] = useState([
    {
      id: 1,
      author: 'Génération Josué',
      date: '1 déc. 2025',
      text: '🎉 Bienvenue sur notre fil d\'actualités ! Restez connectés pour toutes les nouvelles du camp GJ 2025.',
      image: null,
      video: null,
      link: null,
      likes: 12,
      comments: 3
    },
    {
      id: 2,
      author: 'Génération Josué',
      date: '28 nov. 2025',
      text: 'Les inscriptions pour le camp GJ 2025 sont ouvertes ! 🏕️ Ne manquez pas cette occasion unique.',
      image: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=800',
      video: null,
      link: { url: 'http://localhost:3000/inscription', text: 'S\'inscrire maintenant' },
      likes: 24,
      comments: 7
    }
  ]);

  const [newPost, setNewPost] = useState({
    text: '',
    image: '',
    video: '',
    link: { url: '', text: '' }
  });

  const [showPostForm, setShowPostForm] = useState(false);

  const handleAddPost = () => {
    if (!newPost.text.trim()) {
      alert('Veuillez entrer un message');
      return;
    }

    const post = {
      id: Date.now(),
      author: 'Génération Josué',
      date: new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' }),
      text: newPost.text,
      image: newPost.image || null,
      video: newPost.video || null,
      link: newPost.link.url ? newPost.link : null,
      likes: 0,
      comments: 0
    };

    setPosts([post, ...posts]);
    setNewPost({ text: '', image: '', video: '', link: { url: '', text: '' } });
    setShowPostForm(false);
  };

  const handleDeletePost = (id) => {
    if (window.confirm('Supprimer ce post ?')) {
      setPosts(posts.filter(p => p.id !== id));
    }
  };

  const handleLike = (id) => {
    setPosts(posts.map(p => p.id === id ? { ...p, likes: p.likes + 1 } : p));
  };

  return (
    <div className="newsletter-container">
      {/* Header */}
      <div className="newsletter-header">
        <h1>📰 Actualités GJ</h1>
        <p>Toutes les nouvelles de Génération Josué</p>
      </div>

      {/* Bouton créer un post (admin) */}
      <div className="create-post-section">
        {!showPostForm ? (
          <button className="btn-create-post" onClick={() => setShowPostForm(true)}>
            ✏️ Créer un post
          </button>
        ) : (
          <div className="post-form">
            <div className="post-form-header">
              <h3>Nouveau post</h3>
              <button className="btn-close" onClick={() => setShowPostForm(false)}>×</button>
            </div>

            <textarea
              className="post-textarea"
              placeholder="Quoi de neuf chez GJ ?"
              value={newPost.text}
              onChange={(e) => setNewPost({ ...newPost, text: e.target.value })}
              rows={4}
            />

            <div className="post-form-media">
              <div className="form-group">
                <label>🖼️ Image (URL)</label>
                <input
                  type="text"
                  placeholder="https://example.com/image.jpg"
                  value={newPost.image}
                  onChange={(e) => setNewPost({ ...newPost, image: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>🎥 Vidéo YouTube (URL embed)</label>
                <input
                  type="text"
                  placeholder="https://www.youtube.com/embed/VIDEO_ID"
                  value={newPost.video}
                  onChange={(e) => setNewPost({ ...newPost, video: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>🔗 Lien externe</label>
                <input
                  type="text"
                  placeholder="URL du lien"
                  value={newPost.link.url}
                  onChange={(e) => setNewPost({ ...newPost, link: { ...newPost.link, url: e.target.value } })}
                />
                <input
                  type="text"
                  placeholder="Texte du lien"
                  value={newPost.link.text}
                  onChange={(e) => setNewPost({ ...newPost, link: { ...newPost.link, text: e.target.value } })}
                  style={{ marginTop: '0.5rem' }}
                />
              </div>
            </div>

            <button className="btn-publish" onClick={handleAddPost}>
              📤 Publier
            </button>
          </div>
        )}
      </div>

      {/* Liste des posts */}
      <div className="posts-feed">
        {posts.map(post => (
          <div key={post.id} className="post-card">
            <div className="post-header">
              <div className="post-author">
                <div className="author-avatar">GJ</div>
                <div className="author-info">
                  <div className="author-name">{post.author}</div>
                  <div className="post-date">{post.date}</div>
                </div>
              </div>
              <button className="btn-delete-post" onClick={() => handleDeletePost(post.id)}>
                🗑️
              </button>
            </div>

            <div className="post-content">
              <p className="post-text">{post.text}</p>

              {post.image && (
                <div className="post-image">
                  <img src={post.image} alt="Post" />
                </div>
              )}

              {post.video && (
                <div className="post-video">
                  <iframe
                    width="100%"
                    height="315"
                    src={post.video}
                    title="Video"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                </div>
              )}

              {post.link && (
                <a href={post.link.url} target="_blank" rel="noopener noreferrer" className="post-link">
                  <div className="link-card">
                    <div className="link-icon">🔗</div>
                    <div className="link-text">{post.link.text || post.link.url}</div>
                  </div>
                </a>
              )}
            </div>

            <div className="post-footer">
              <button className="btn-action" onClick={() => handleLike(post.id)}>
                ❤️ {post.likes}
              </button>
              <button className="btn-action">
                💬 {post.comments}
              </button>
              <button className="btn-action">
                🔄 Partager
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default NewsletterPage;
