import { useEffect, useMemo, useState } from "react";
import api from "../lib/api.js";

const STORAGE_KEY = "dj_silver_guest_name";

const merchItems = [
  {
    id: "silver-tee",
    name: "Silver Pulse T-Shirt",
    price: 35,
    description: "Premium cotton tee with reflective DJ Silver chest print.",
    image:
      "https://images.unsplash.com/photo-1581655353564-df123a1eb820?auto=format&fit=crop&q=80&w=900",
    hasSize: true,
  },
  {
    id: "silver-mobile-cover",
    name: "Neon Wave Mobile Cover",
    price: 24,
    description: "Shockproof phone case with neon waveform signature art.",
    image:
      "https://images.unsplash.com/photo-1601593346740-925612772716?auto=format&fit=crop&q=80&w=900",
    hasSize: false,
  },
  {
    id: "silver-cap",
    name: "Midnight DJ Cap",
    price: 29,
    description: "Structured black cap with embroidered silver icon mark.",
    image:
      "https://images.unsplash.com/photo-1521369909029-2afed882baee?auto=format&fit=crop&q=80&w=900",
    hasSize: false,
  },
  {
    id: "silver-hoodie",
    name: "Afterhours Hoodie",
    price: 62,
    description: "Heavyweight oversized hoodie for late-night set energy.",
    image:
      "https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&q=80&w=900",
    hasSize: true,
  },
];

const DEMO_POST_ID = "demo-post-1";
const demoPost = {
  _id: DEMO_POST_ID,
  authorName: "DJ Silver Team",
  content:
    "Welcome to the Guest Wall. Drop your best event moment, photos, and set requests here.",
  imagePath:
    "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&q=80&w=1200",
  likesCount: 12,
  demoLiked: false,
  createdAt: "2026-02-15T12:00:00.000Z",
  isDemo: true,
};

const demoComment = {
  _id: "demo-comment-1",
  postId: DEMO_POST_ID,
  authorName: "Fan Admin",
  content: "Demo post: feel free to add comments and reactions.",
  createdAt: "2026-02-15T12:30:00.000Z",
};

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

  const [showOrderModal, setShowOrderModal] = useState(false);
  const [selectedMerch, setSelectedMerch] = useState(null);
  const [checkoutItemId, setCheckoutItemId] = useState("");
  const [orderStatus, setOrderStatus] = useState("idle");
  const [orderMessage, setOrderMessage] = useState("");
  const [orderId, setOrderId] = useState("");
  const [orderForm, setOrderForm] = useState({
    customerName: "",
    email: "",
    phone: "",
    address: "",
    quantity: 1,
    size: "M",
    note: "",
  });

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

        setPosts([demoPost, ...fetchedPosts]);
        setComments([demoComment, ...fetchedComments]);
      })
      .catch(() => {
        if (!isMounted) return;
        setPosts([demoPost]);
        setComments([demoComment]);
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

  useEffect(() => {
    const checkoutState = new URLSearchParams(window.location.search).get("checkout");
    if (checkoutState === "success") {
      setOrderStatus("success");
      setOrderMessage("Payment completed successfully.");
    } else if (checkoutState === "cancelled") {
      setOrderStatus("error");
      setOrderMessage("Payment was cancelled.");
    }
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
    if (postId === DEMO_POST_ID) {
      setPosts((prev) =>
        prev.map((post) => {
          if (post._id !== DEMO_POST_ID) return post;
          const currentlyLiked = Boolean(post.demoLiked);
          return {
            ...post,
            demoLiked: !currentlyLiked,
            likesCount: currentlyLiked ? Math.max(0, post.likesCount - 1) : post.likesCount + 1,
          };
        })
      );
      return;
    }

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

    if (postId === DEMO_POST_ID) {
      setComments((prev) => [
        {
          _id: `demo-local-${Date.now()}`,
          postId: DEMO_POST_ID,
          authorName: guestName.trim(),
          content,
          createdAt: new Date().toISOString(),
        },
        ...prev,
      ]);
      setCommentDrafts((prev) => ({ ...prev, [postId]: "" }));
      return;
    }

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

  const openOrderModal = (item) => {
    setSelectedMerch(item);
    setOrderStatus("idle");
    setOrderMessage("");
    setOrderId("");
    setOrderForm((prev) => ({
      ...prev,
      customerName: prev.customerName || guestName || "",
      quantity: 1,
      size: item.hasSize ? prev.size || "M" : "N/A",
    }));
    setShowOrderModal(true);
  };

  const handleStripeCheckout = async (item) => {
    setCheckoutItemId(item.id);
    setOrderStatus("loading");
    setOrderMessage("");
    setOrderId("");

    try {
      const response = await api.post("/api/merch/checkout-session", {
        itemId: item.id,
        quantity: 1,
        size: item.hasSize ? "M" : "N/A",
        origin: window.location.origin,
      });

      const checkoutUrl = response.data?.url;
      if (!checkoutUrl) {
        throw new Error("Checkout URL missing");
      }

      window.location.assign(checkoutUrl);
    } catch (error) {
      setOrderStatus("error");
      setOrderMessage(
        error.response?.data?.message || "Could not start Stripe checkout. Please try again."
      );
      setCheckoutItemId("");
    }
  };

  const updateOrderField = (field, value) => {
    setOrderForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmitOrder = async () => {
    if (!selectedMerch) return;

    const customerName = orderForm.customerName.trim();
    const email = orderForm.email.trim();
    const phone = orderForm.phone.trim();
    const address = orderForm.address.trim();

    if (!customerName || !email || !address) {
      setOrderStatus("error");
      setOrderMessage("Name, email and address are required.");
      return;
    }
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      setOrderStatus("error");
      setOrderMessage("Please enter a valid email address.");
      return;
    }
    if (address.length < 10) {
      setOrderStatus("error");
      setOrderMessage("Please enter a complete shipping address.");
      return;
    }
    if (phone && !/^[+()\d\s-]{7,20}$/.test(phone)) {
      setOrderStatus("error");
      setOrderMessage("Phone format is invalid.");
      return;
    }

    setOrderStatus("loading");
    setOrderMessage("");
    setOrderId("");

    try {
      const response = await api.post("/api/merch/orders", {
        itemId: selectedMerch.id,
        itemName: selectedMerch.name,
        unitPrice: selectedMerch.price,
        quantity: Number(orderForm.quantity || 1),
        size: selectedMerch.hasSize ? orderForm.size || "M" : "N/A",
        customerName,
        email,
        phone,
        address,
        note: orderForm.note.trim(),
      });

      setOrderStatus("success");
      setOrderMessage("Order submitted successfully.");
      setOrderId(response.data.orderId || "");
      setOrderForm((prev) => ({
        ...prev,
        customerName,
        quantity: 1,
        note: "",
      }));
    } catch (error) {
      setOrderStatus("error");
      setOrderMessage(
        error.response?.data?.message || "Could not submit order. Please try again."
      );
    }
  };

  return (
    <div className="full-bleed flex flex-col gap-8 pb-16">
      <header>
        <p className="text-xs uppercase tracking-[0.4em] text-slate-500">Fans</p>
        <h1 className="mt-3 text-3xl font-semibold glow-text">Guest Wall & Merch</h1>
      </header>

      <section className="glass-card neon-border rounded-3xl p-6">
        <div className="mb-5 flex items-center justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Merchandise</p>
            <p className="mt-1 text-sm text-slate-300">Official fan gear available to order now.</p>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {merchItems.map((item) => (
            <article key={item.id} className="rounded-2xl border border-white/10 bg-black/45 p-3">
              <img
                src={item.image}
                alt={item.name}
                className="h-40 w-full rounded-xl object-cover"
                loading="lazy"
              />
              <p className="mt-3 text-sm font-semibold text-slate-100">{item.name}</p>
              <p className="mt-1 text-xs text-slate-400">{item.description}</p>
              <div className="mt-3 flex items-center justify-between">
                <span className="rounded-full border border-cyan-400/40 bg-cyan-400/10 px-3 py-1 text-xs text-cyan-200">
                  ${item.price}
                </span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleStripeCheckout(item)}
                    disabled={checkoutItemId === item.id}
                    className="rounded-full border border-emerald-400 bg-emerald-400/10 px-4 py-1 text-[10px] uppercase tracking-[0.2em] text-emerald-100 disabled:opacity-60"
                  >
                    {checkoutItemId === item.id ? "Redirecting..." : "Order"}
                  </button>
                  <button
                    type="button"
                    onClick={() => openOrderModal(item)}
                    className="rounded-full border border-cyan-400 bg-cyan-400/10 px-4 py-1 text-[10px] uppercase tracking-[0.2em] text-cyan-100"
                  >
                    Manual
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>

        {orderMessage && !showOrderModal && (
          <p className={`mt-4 text-xs ${orderStatus === "error" ? "text-rose-300" : "text-emerald-300"}`}>
            {orderMessage}
          </p>
        )}
      </section>

      <section>
        <div className="mb-4 flex items-center justify-between gap-4">
          <h2 className="text-lg font-semibold text-slate-100">Guest Posts</h2>
          <button
            onClick={() => setShowCreate(true)}
            className="rounded-full border border-cyan-400 bg-cyan-400/10 px-5 py-2 text-xs uppercase tracking-[0.25em] text-cyan-100"
          >
            Create Post
          </button>
        </div>

        {loading ? (
          <div className="text-sm text-slate-400">Loading fan posts...</div>
        ) : posts.length === 0 ? (
          <div className="glass-card neon-border rounded-2xl p-6 text-sm text-slate-400">
            No posts yet. Start the first one.
          </div>
        ) : (
          <div className="columns-1 gap-6 md:columns-2 xl:columns-3">
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
                    aria-label="Toggle like"
                  >
                    <span className="inline-flex items-center gap-1">
                      {post._id === DEMO_POST_ID && post.demoLiked ? "♥" : "♡"}{" "}
                      {post.likesCount || 0}
                    </span>
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
          </div>
        )}
      </section>

      {showOrderModal && selectedMerch && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-6">
          <div className="glass-card neon-border w-full max-w-xl rounded-2xl p-6">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Merch Order</p>
                <h3 className="mt-1 text-lg font-semibold text-slate-100">{selectedMerch.name}</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowOrderModal(false)}
                className="rounded-full border border-white/10 px-3 py-1 text-xs text-slate-300"
              >
                Close
              </button>
            </div>

            <div className="mt-4 grid gap-3">
              <input
                value={orderForm.customerName}
                onChange={(event) => updateOrderField("customerName", event.target.value)}
                className="rounded-lg border border-white/10 bg-black/40 px-4 py-2 text-sm"
                placeholder="Full name"
              />
              <input
                value={orderForm.email}
                onChange={(event) => updateOrderField("email", event.target.value)}
                type="email"
                className="rounded-lg border border-white/10 bg-black/40 px-4 py-2 text-sm"
                placeholder="Email"
              />
              <input
                value={orderForm.phone}
                onChange={(event) => updateOrderField("phone", event.target.value)}
                className="rounded-lg border border-white/10 bg-black/40 px-4 py-2 text-sm"
                placeholder="Phone (optional)"
              />
              <textarea
                value={orderForm.address}
                onChange={(event) => updateOrderField("address", event.target.value)}
                className="min-h-[90px] rounded-lg border border-white/10 bg-black/40 px-4 py-2 text-sm"
                placeholder="Shipping address"
              />

              <div className="grid gap-3 sm:grid-cols-2">
                <label className="text-xs uppercase tracking-[0.15em] text-slate-400">
                  Quantity
                  <input
                    value={orderForm.quantity}
                    onChange={(event) =>
                      updateOrderField("quantity", Math.max(1, Number(event.target.value || 1)))
                    }
                    type="number"
                    min="1"
                    max="20"
                    className="mt-1 w-full rounded-lg border border-white/10 bg-black/40 px-4 py-2 text-sm normal-case"
                  />
                </label>

                {selectedMerch.hasSize ? (
                  <label className="text-xs uppercase tracking-[0.15em] text-slate-400">
                    Size
                    <select
                      value={orderForm.size}
                      onChange={(event) => updateOrderField("size", event.target.value)}
                      className="mt-1 w-full rounded-lg border border-white/10 bg-black/40 px-4 py-2 text-sm normal-case"
                    >
                      <option>XS</option>
                      <option>S</option>
                      <option>M</option>
                      <option>L</option>
                      <option>XL</option>
                      <option>XXL</option>
                    </select>
                  </label>
                ) : (
                  <div className="rounded-lg border border-white/10 bg-black/30 px-4 py-2 text-xs text-slate-400 sm:self-end">
                    Size: N/A
                  </div>
                )}
              </div>

              <textarea
                value={orderForm.note}
                onChange={(event) => updateOrderField("note", event.target.value)}
                className="min-h-[70px] rounded-lg border border-white/10 bg-black/40 px-4 py-2 text-sm"
                placeholder="Order note (optional)"
              />
            </div>

            <div className="mt-4 flex items-center justify-between text-sm text-slate-300">
              <span>Total</span>
              <span className="font-semibold text-cyan-200">
                ${(selectedMerch.price * Number(orderForm.quantity || 1)).toFixed(2)}
              </span>
            </div>

            <button
              type="button"
              onClick={handleSubmitOrder}
              disabled={orderStatus === "loading"}
              className="mt-4 w-full rounded-full border border-cyan-400 bg-cyan-400/10 px-5 py-2 text-xs uppercase tracking-[0.3em] text-cyan-100 disabled:opacity-50"
            >
              {orderStatus === "loading" ? "Submitting..." : "Place Order"}
            </button>

            {orderMessage && (
              <p className={`mt-3 text-xs ${orderStatus === "error" ? "text-rose-300" : "text-emerald-300"}`}>
                {orderMessage}
              </p>
            )}
            {orderId && (
              <p className="mt-1 text-[10px] uppercase tracking-[0.2em] text-cyan-300">
                Order ID: {orderId}
              </p>
            )}
          </div>
        </div>
      )}

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
