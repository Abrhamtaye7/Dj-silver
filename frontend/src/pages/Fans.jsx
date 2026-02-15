import { useEffect, useMemo, useState } from "react";
import api from "../lib/api.js";

const STORAGE_KEY = "dj_silver_guest_name";

const getStoredName = () => {
  try {
    return localStorage.getItem(STORAGE_KEY) || "";
  } catch {
    return "";
  }
};

function Fans() {
  const [guestName, setGuestName] = useState(getStoredName);
  const [showModal, setShowModal] = useState(() => !getStoredName());
  const [posts, setPosts] = useState([]);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [newPost, setNewPost] = useState({ content: "", image: null });
  const [postStatus, setPostStatus] = useState("idle");
  const [commentDrafts, setCommentDrafts] = useState({});

  useEffect(() => {
    let isMounted = true;

    api
      .get("/api/fans")
      .then((response) => {
        if (!isMounted) return;

        const fetchedPosts = Array.isArray(response.data.posts)
          ? response.data.posts.map((post) => ({
              ...post,
              likesCount: Array.isArray(post.likes) ? post.likes.length : 0,
            }))
          : [];

        const fetchedComments = Array.isArray(response.data.comments)
          ? response.data.comments
          : [];

        setPosts(fetchedPosts);
        setComments(fetchedComments);
      })
      .catch(() => {
        if (!isMounted) return;
        setPosts([]);
        setComments([]);
      })
      .finally(() => {
        if (isMounted) {
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const commentsByPostId = useMemo(() => {
    const grouped = new Map();

    comments.forEach((comment) => {
      const postId = String(comment.postId || "");
      if (!grouped.has(postId)) grouped.set(postId, []);
      grouped.get(postId).push(comment);
    });

    return grouped;
  }, [comments]);

  const handleSaveName = () => {
    const nextName = guestName.trim();
    if (!nextName) return;
    localStorage.setItem(STORAGE_KEY, nextName);
    setGuestName(nextName);
    setShowModal(false);
  };

  const handleCreatePost = async () => {
    if (!guestName.trim()) {
      setShowModal(true);
      return;
    }

    if (!newPost.content.trim()) return;

    setPostStatus("loading");

    try {
      const formData = new FormData();
      formData.append("authorName", guestName.trim());
      formData.append("content", newPost.content.trim());

      if (newPost.image) {
        formData.append("image", newPost.image);
      }

      const response = await api.post("/api/fans", formData);
      const createdPost = response.data.post || null;

      if (createdPost) {
        setPosts((prev) => [
          {
            ...createdPost,
            likesCount: Array.isArray(createdPost.likes)
              ? createdPost.likes.length
              : 0,
          },
          ...prev,
        ]);
      }

      setNewPost({ content: "", image: null });
      setShowCreate(false);
      setPostStatus("success");
    } catch {
      setPostStatus("error");
    }
  };

  const handleLike = async (postId) => {
    try {
      const response = await api.post(`/api/fans/${postId}/like`);
      const likesCount = Number(response.data.likes || 0);

      setPosts((prev) =>
        prev.map((post) =>
          post._id === postId
            ? {
                ...post,
                likesCount,
              }
            : post
        )
      );
    } catch {
      // do nothing on transient network issues
    }
  };

  const handleCommentChange = (postId, value) => {
    setCommentDrafts((prev) => ({ ...prev, [postId]: value }));
  };

  const handleCommentSubmit = async (postId) => {
    const content = (commentDrafts[postId] || "").trim();
    if (!content || !guestName.trim()) return;

    try {
      const response = await api.post(`/api/fans/${postId}/comments`, {
        authorName: guestName.trim(),
        content,
      });

      if (response.data.comment) {
        setComments((prev) => [response.data.comment, ...prev]);
      }

      setCommentDrafts((prev) => ({ ...prev, [postId]: "" }));
    } catch {
      // do nothing on transient network issues
    }
  };

  return (
    <div className="full-bleed flex flex-col gap-6 pb-16">
      <header>
        <p className="text-xs uppercase tracking-[0.4em] text-slate-500">Fans</p>
        <h1 className="mt-3 text-3xl font-semibold glow-text">Guest Wall</h1>
      </header>

      {loading ? (
        <div className="text-sm text-slate-400">Loading fan posts...</div>
      ) : posts.length === 0 ? (
        <div className="glass-card neon-border rounded-2xl p-6 text-sm text-slate-400">
          No posts yet. Start the first one.
        </div>
      ) : (
        <section className="columns-1 gap-6 md:columns-2 xl:columns-3">
          {posts.map((post) => (
            <article
              key={post._id}
              className="glass-card neon-border mb-6 break-inside-avoid rounded-2xl p-5"
            >
              {post.imagePath && (
                <img
                  src={post.imagePath}
                  alt="Fan upload"
                  className="mb-4 h-auto w-full rounded-xl object-cover"
                />
              )}

              <p className="text-sm text-slate-200">{post.content}</p>

              <div className="mt-4 flex items-center justify-between text-xs text-slate-400">
                <span>{post.authorName}</span>
                <button
                  onClick={() => handleLike(post._id)}
                  className="rounded-full border border-cyan-400/35 px-3 py-1 text-cyan-300 transition hover:bg-cyan-400/10"
                >
                  {post.likesCount || 0} likes
                </button>
              </div>

              <div className="mt-4 space-y-3 text-xs text-slate-400">
                {(commentsByPostId.get(post._id) || []).slice(0, 3).map((comment) => (
                  <div key={comment._id}>
                    <span className="text-slate-300">{comment.authorName}:</span> {comment.content}
                  </div>
                ))}

                <div className="flex gap-2">
                  <input
                    value={commentDrafts[post._id] || ""}
                    onChange={(event) =>
                      handleCommentChange(post._id, event.target.value)
                    }
                    className="flex-1 rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-xs"
                    placeholder="Leave a comment"
                  />
                  <button
                    onClick={() => handleCommentSubmit(post._id)}
                    className="rounded-full border border-cyan-400 bg-cyan-400/10 px-3 py-2 text-[10px] uppercase tracking-[0.2em] text-cyan-100"
                  >
                    Send
                  </button>
                </div>
              </div>
            </article>
          ))}
        </section>
      )}

      <button
        type="button"
        onClick={() => setShowCreate(true)}
        className="fixed bottom-7 right-6 z-40 h-14 w-14 rounded-full border border-cyan-400 bg-black/80 text-2xl text-cyan-200 shadow-[0_0_30px_rgba(34,211,238,0.25)] transition hover:scale-105 hover:bg-cyan-400/15"
        aria-label="Create post"
      >
        +
      </button>

      {showCreate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-6">
          <div className="glass-card neon-border w-full max-w-lg rounded-2xl p-6">
            <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Create Post</p>

            <textarea
              value={newPost.content}
              onChange={(event) =>
                setNewPost((prev) => ({ ...prev, content: event.target.value }))
              }
              className="mt-4 min-h-[120px] w-full rounded-lg border border-white/10 bg-black/40 px-4 py-2 text-sm"
              placeholder="Share your moment..."
              maxLength={500}
            />
            <p className="mt-1 text-right text-[10px] uppercase tracking-[0.2em] text-slate-500">
              {newPost.content.length}/500
            </p>

            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={(event) =>
                setNewPost((prev) => ({ ...prev, image: event.target.files?.[0] || null }))
              }
              className="mt-4 w-full text-xs text-slate-400"
            />

            <div className="mt-6 flex items-center justify-between">
              <button
                onClick={() => setShowCreate(false)}
                className="rounded-full border border-white/10 px-5 py-2 text-xs uppercase tracking-[0.3em] text-slate-400"
              >
                Cancel
              </button>
              <button
                onClick={handleCreatePost}
                className="rounded-full border border-cyan-400 bg-cyan-400/10 px-5 py-2 text-xs uppercase tracking-[0.3em] text-cyan-100 disabled:opacity-50"
                disabled={postStatus === "loading"}
              >
                {postStatus === "loading" ? "Posting..." : "Post"}
              </button>
            </div>

            {postStatus === "error" && (
              <p className="mt-4 text-xs text-rose-300">Could not create post.</p>
            )}
          </div>
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-6">
          <div className="glass-card neon-border w-full max-w-md rounded-2xl p-6">
            <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Welcome</p>
            <h2 className="mt-3 text-xl font-semibold">Enter your name</h2>
            <input
              value={guestName}
              onChange={(event) => setGuestName(event.target.value)}
              className="mt-4 w-full rounded-lg border border-white/10 bg-black/40 px-4 py-2 text-sm text-slate-100"
              placeholder="Your name"
              maxLength={30}
            />
            <button
              onClick={handleSaveName}
              className="mt-4 w-full rounded-full border border-cyan-400 bg-cyan-400/10 px-5 py-2 text-xs uppercase tracking-[0.3em] text-cyan-100"
            >
              Save
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Fans;
