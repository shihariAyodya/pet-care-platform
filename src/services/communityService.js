import { supabase } from "./supabaseClient";

const STORAGE_POSTS_KEY = "petzy_community_posts";
const STORAGE_COMMENTS_PREFIX = "petzy_community_comments_";
const STORAGE_NOTIFICATIONS_KEY = "petzy_community_notifications";
const STORAGE_FOLLOWS_KEY = "petzy_community_follows";
const STORAGE_BOOPS_KEY = "petzy_user_booped_posts";

// Default starter posts featuring cute pets to make the feed lively immediately
const INITIAL_STARTER_POSTS = [
  {
    _id: "starter_1",
    userId: "usr_milo",
    username: "emily_milo",
    petName: "Milo",
    breed: "Golden Retriever",
    humanName: "Emily Carter",
    bio: "Morning walk at Galle Face Green! Milo found the biggest stick in Sri Lanka 🐶🏖️",
    imageUrl: "https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=1200&q=80",
    authorAvatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80",
    boopCount: 38,
    createdAt: new Date(Date.now() - 3600 * 1000 * 2).toISOString()
  },
  {
    _id: "starter_2",
    userId: "usr_luna",
    username: "luna_queen",
    petName: "Luna",
    breed: "British Shorthair",
    humanName: "Dilshan",
    bio: "Sunbeams are my personal property. Please do not disturb my afternoon nap 🐾☀️",
    imageUrl: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=1200&q=80",
    authorAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80",
    boopCount: 52,
    createdAt: new Date(Date.now() - 3600 * 1000 * 6).toISOString()
  },
  {
    _id: "starter_3",
    userId: "usr_cooper",
    username: "frenchie_cooper",
    petName: "Cooper",
    breed: "French Bulldog",
    humanName: "Saman & Kavi",
    bio: "Dressed up for his vet checkup today! The doctor gave him 5 stars for being a good boy 🩺✨",
    imageUrl: "https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&w=1200&q=80",
    authorAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
    boopCount: 29,
    createdAt: new Date(Date.now() - 3600 * 1000 * 18).toISOString()
  },
  {
    _id: "starter_4",
    userId: "usr_charlie",
    username: "beagle_charlie",
    petName: "Charlie",
    breed: "Beagle",
    humanName: "Arosha",
    bio: "Sniffed out the hidden treats in under 10 seconds. Champion sniffer! 🦴❤️",
    imageUrl: "https://images.unsplash.com/photo-1537151608828-ea2b11777ee8?auto=format&fit=crop&w=1200&q=80",
    authorAvatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80",
    boopCount: 44,
    createdAt: new Date(Date.now() - 3600 * 1000 * 28).toISOString()
  }
];

// Helper to convert/compress file to data URL
export const compressImageFile = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target.result;
      if (file.size > 1.2 * 1024 * 1024) {
        const img = new Image();
        img.src = dataUrl;
        img.onload = () => {
          const canvas = document.createElement("canvas");
          const MAX_SIZE = 1200;
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > MAX_SIZE) {
              height = Math.round((height * MAX_SIZE) / width);
              width = MAX_SIZE;
            }
          } else {
            if (height > MAX_SIZE) {
              width = Math.round((width * MAX_SIZE) / height);
              height = MAX_SIZE;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext("2d");
          ctx.drawImage(img, 0, 0, width, height);
          resolve(canvas.toDataURL("image/jpeg", 0.85));
        };
        img.onerror = () => resolve(dataUrl);
      } else {
        resolve(dataUrl);
      }
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

// Local storage helper with robust error handling
export const getLocalPosts = () => {
  try {
    const saved = localStorage.getItem(STORAGE_POSTS_KEY);
    if (!saved) {
      localStorage.setItem(STORAGE_POSTS_KEY, JSON.stringify(INITIAL_STARTER_POSTS));
      return INITIAL_STARTER_POSTS;
    }
    const parsed = JSON.parse(saved);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
    return INITIAL_STARTER_POSTS;
  } catch {
    return INITIAL_STARTER_POSTS;
  }
};

export const setLocalPosts = (posts) => {
  try {
    if (Array.isArray(posts)) {
      localStorage.setItem(STORAGE_POSTS_KEY, JSON.stringify(posts));
    }
  } catch (err) {
    console.warn("Could not save community posts to local storage:", err);
  }
};

// Fetch community posts combining Supabase & local storage
export const fetchCommunityPosts = async () => {
  const localPosts = getLocalPosts();
  let supabasePosts = [];

  try {
    const { data, error } = await supabase
      .from("posts")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error && Array.isArray(data)) {
      // Fetch author profiles if possible
      const userIds = [...new Set(data.map((p) => p?.user_id).filter(Boolean))];
      let profilesMap = {};

      if (userIds.length > 0) {
        try {
          const { data: profilesData } = await supabase
            .from("profiles")
            .select("id, username, pet_name, human_name, avatar_url")
            .in("id", userIds);

          if (profilesData && Array.isArray(profilesData)) {
            profilesData.forEach((p) => {
              if (p && p.id) {
                profilesMap[p.id] = p;
              }
            });
          }
        } catch (pe) {
          console.warn("Could not fetch Supabase profiles:", pe);
        }
      }

      supabasePosts = data
        .filter((post) => post && post.id)
        .map((post) => {
          const author = profilesMap[post.user_id] || {};
          return {
            _id: `sb_${post.id}`,
            supabaseId: post.id,
            userId: post.user_id || "sb_user",
            username: author.username || String(post.human_name || "").toLowerCase().replace(/\s+/g, "_") || "petzy_friend",
            authorAvatar: author.avatar_url || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
            petName: post.pet_name || "Petzy Buddy",
            breed: post.breed || "Companion",
            humanName: post.human_name || author.human_name || "Pet Parent",
            bio: post.bio || "",
            imageUrl: post.image_url || "https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=1000&q=80",
            boopCount: Number(post.boop_count) || 0,
            createdAt: post.created_at || new Date().toISOString()
          };
        });
    }
  } catch (err) {
    console.warn("Supabase fetch notice (using local posts):", err);
  }

  // Merge Supabase posts and local posts without duplicates
  const postMap = new Map();
  if (Array.isArray(localPosts)) {
    localPosts.forEach((p) => {
      if (p && p._id) postMap.set(p._id, p);
    });
  }
  if (Array.isArray(supabasePosts)) {
    supabasePosts.forEach((p) => {
      if (p && p._id && !postMap.has(p._id)) {
        postMap.set(p._id, p);
      }
    });
  }

  const merged = Array.from(postMap.values()).sort(
    (a, b) => new Date(b?.createdAt || 0) - new Date(a?.createdAt || 0)
  );

  return merged.length > 0 ? merged : INITIAL_STARTER_POSTS;
};

// Create a new community post
export const createCommunityPost = async ({
  currentUser,
  petName,
  breed,
  bio,
  imageUrl,
  imageFile
}) => {
  if (!currentUser) {
    throw new Error("You must be logged into Petzy to share a post.");
  }

  let finalImageUrl = imageUrl?.trim() || "";

  // Prepare Image
  if (imageFile) {
    try {
      const cleanExt = (imageFile.name.split(".").pop() || "jpg").toLowerCase().replace(/[^a-z0-9]/g, "");
      const fileName = `petzy-${currentUser.id || "guest"}/${Date.now()}-${Math.random().toString(36).slice(2, 7)}.${cleanExt}`;

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("post-images")
        .upload(fileName, imageFile, { upsert: false });

      if (!uploadError && uploadData) {
        const { data: urlData } = supabase.storage
          .from("post-images")
          .getPublicUrl(fileName);
        finalImageUrl = urlData.publicUrl;
      } else {
        finalImageUrl = await compressImageFile(imageFile);
      }
    } catch {
      finalImageUrl = await compressImageFile(imageFile);
    }
  }

  if (!finalImageUrl) {
    throw new Error("Please provide or upload a pet photo.");
  }

  const newPost = {
    _id: "post_" + Date.now() + "_" + Math.random().toString(36).slice(2, 6),
    userId: currentUser.id || "usr_demo",
    username: currentUser.email?.split("@")[0].replace(/[^a-zA-Z0-9_]/g, "_") || "petzy_user",
    petName: petName?.trim() || currentUser.myPets?.[0]?.name || "My Furry Friend",
    breed: breed?.trim() || currentUser.myPets?.[0]?.breed || "Companion",
    humanName: currentUser.fullName || "Petzy Member",
    bio: bio?.trim() || "",
    imageUrl: finalImageUrl,
    authorAvatar: currentUser.avatar || currentUser.myPets?.[0]?.photo || "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80",
    boopCount: 0,
    createdAt: new Date().toISOString()
  };

  // 1. Immediately store in LocalStorage for rock-solid persistence
  const currentPosts = getLocalPosts();
  const updatedPosts = [newPost, ...currentPosts];
  setLocalPosts(updatedPosts);

  // 2. Try inserting into Supabase if session active
  try {
    const { data: sbData, error: sbError } = await supabase
      .from("posts")
      .insert([
        {
          pet_name: newPost.petName,
          breed: newPost.breed,
          human_name: newPost.humanName,
          bio: newPost.bio,
          image_url: newPost.imageUrl,
          boop_count: 0
        }
      ])
      .select()
      .single();

    if (!sbError && sbData) {
      newPost.supabaseId = sbData.id;
    }
  } catch (sbErr) {
    console.info("Supabase sync notice (saved locally):", sbErr);
  }

  return newPost;
};

// Boop (Like) a post
export const toggleBoopPost = async (postId, currentUser) => {
  if (!postId) return null;
  const localPosts = getLocalPosts();
  const postIndex = localPosts.findIndex((p) => p && p._id === postId);

  const boopedKey = STORAGE_BOOPS_KEY;
  let userBoops;
  try {
    userBoops = JSON.parse(localStorage.getItem(boopedKey) || "[]");
  } catch {
    userBoops = [];
  }
  if (!Array.isArray(userBoops)) userBoops = [];

  const isAlreadyBooped = userBoops.includes(postId);
  const delta = isAlreadyBooped ? -1 : 1;

  if (isAlreadyBooped) {
    userBoops = userBoops.filter((id) => id !== postId);
  } else {
    userBoops.push(postId);
  }
  localStorage.setItem(boopedKey, JSON.stringify(userBoops));

  let updatedCount = 0;
  if (postIndex !== -1) {
    const currentCount = Number(localPosts[postIndex].boopCount) || 0;
    updatedCount = Math.max(0, currentCount + delta);
    localPosts[postIndex].boopCount = updatedCount;
    setLocalPosts(localPosts);
  }

  // Try updating Supabase
  const targetPost = localPosts[postIndex];
  if (targetPost && targetPost.supabaseId) {
    try {
      await supabase
        .from("posts")
        .update({ boop_count: updatedCount })
        .eq("id", targetPost.supabaseId);
    } catch (e) {
      console.warn("Supabase boop update notice:", e);
    }
  }

  // Record notification for the author if not booping own post
  if (!isAlreadyBooped && currentUser && targetPost && targetPost.userId !== currentUser.id) {
    addNotification({
      type: "boop",
      recipientId: targetPost.userId,
      senderName: currentUser.fullName || "A Petzy friend",
      senderAvatar: currentUser.avatar,
      petName: targetPost.petName,
      postId: targetPost._id
    });
  }

  return { isBooped: !isAlreadyBooped, newCount: updatedCount };
};

export const hasUserBooped = (postId) => {
  if (!postId) return false;
  try {
    const userBoops = JSON.parse(localStorage.getItem(STORAGE_BOOPS_KEY) || "[]");
    return Array.isArray(userBoops) && userBoops.includes(postId);
  } catch {
    return false;
  }
};

// Delete post
export const deleteCommunityPost = async (postId, currentUserId) => {
  const localPosts = getLocalPosts();
  const target = localPosts.find((p) => p && p._id === postId);

  if (target && target.userId && target.userId !== currentUserId) {
    throw new Error("You can only delete your own posts.");
  }

  const filtered = localPosts.filter((p) => p && p._id !== postId);
  setLocalPosts(filtered);

  if (target?.supabaseId) {
    try {
      await supabase.from("posts").delete().eq("id", target.supabaseId);
    } catch (e) {
      console.warn("Supabase delete notice:", e);
    }
  }

  return true;
};

// Comments Management
export const fetchPostComments = async (postId) => {
  if (!postId) return [];
  const key = STORAGE_COMMENTS_PREFIX + postId;
  let localComments;
  try {
    localComments = JSON.parse(localStorage.getItem(key) || "[]");
  } catch {
    localComments = [];
  }
  if (!Array.isArray(localComments)) localComments = [];

  let supabaseComments = [];
  const sbId = postId.startsWith("sb_") ? postId.replace("sb_", "") : null;

  if (sbId) {
    try {
      const { data, error } = await supabase
        .from("comments")
        .select(`
          id,
          content,
          created_at,
          user_id,
          profiles (username, pet_name, avatar_url, human_name)
        `)
        .eq("post_id", sbId)
        .order("created_at", { ascending: true });

      if (!error && Array.isArray(data)) {
        supabaseComments = data.map((c) => ({
          id: "sb_" + c.id,
          authorName: c.profiles?.human_name || c.profiles?.pet_name || "Petzy Friend",
          authorAvatar: c.profiles?.avatar_url || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80",
          petName: c.profiles?.pet_name || "Pet",
          content: c.content,
          createdAt: c.created_at
        }));
      }
    } catch (e) {
      console.warn("Supabase comments notice:", e);
    }
  }

  return [...supabaseComments, ...localComments];
};

export const addPostComment = async (postId, currentUser, content) => {
  if (!currentUser) throw new Error("Please log in to leave a comment.");
  if (!content || !content.trim()) return null;

  const newComment = {
    id: "cm_" + Date.now(),
    postId,
    userId: currentUser.id || "usr_demo",
    authorName: currentUser.fullName || "Petzy Member",
    authorAvatar: currentUser.avatar || "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=100&q=80",
    petName: currentUser.myPets?.[0]?.name || "Buddy",
    content: content.trim(),
    createdAt: new Date().toISOString()
  };

  const key = STORAGE_COMMENTS_PREFIX + postId;
  let comments;
  try {
    comments = JSON.parse(localStorage.getItem(key) || "[]");
  } catch {
    comments = [];
  }
  if (!Array.isArray(comments)) comments = [];
  comments.push(newComment);
  localStorage.setItem(key, JSON.stringify(comments));

  const sbId = postId.startsWith("sb_") ? postId.replace("sb_", "") : null;
  if (sbId) {
    try {
      await supabase.from("comments").insert([
        {
          post_id: sbId,
          content: newComment.content
        }
      ]);
    } catch (e) {
      console.warn("Supabase comment notice:", e);
    }
  }

  return newComment;
};

// Notifications Management
export const getNotifications = (userId) => {
  try {
    const all = JSON.parse(localStorage.getItem(STORAGE_NOTIFICATIONS_KEY) || "[]");
    if (!Array.isArray(all)) return [];
    return all.filter((n) => n && (!n.recipientId || n.recipientId === userId));
  } catch {
    return [];
  }
};

export const addNotification = (item) => {
  try {
    const all = JSON.parse(localStorage.getItem(STORAGE_NOTIFICATIONS_KEY) || "[]");
    const arr = Array.isArray(all) ? all : [];
    const newItem = {
      id: "notif_" + Date.now(),
      createdAt: new Date().toISOString(),
      read: false,
      ...item
    };
    arr.unshift(newItem);
    localStorage.setItem(STORAGE_NOTIFICATIONS_KEY, JSON.stringify(arr.slice(0, 30)));
  } catch (e) {
    console.warn("Could not save notification:", e);
  }
};

export const markNotificationsAsRead = (userId) => {
  try {
    const all = JSON.parse(localStorage.getItem(STORAGE_NOTIFICATIONS_KEY) || "[]");
    if (!Array.isArray(all)) return;
    const updated = all.map((n) =>
      n && (!n.recipientId || n.recipientId === userId) ? { ...n, read: true } : n
    );
    localStorage.setItem(STORAGE_NOTIFICATIONS_KEY, JSON.stringify(updated));
  } catch (e) {
    console.warn("Could not mark notifications:", e);
  }
};

// Follows
export const getFollows = () => {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_FOLLOWS_KEY) || "[]");
    return Array.isArray(saved) ? saved : [];
  } catch {
    return [];
  }
};

export const toggleFollowUser = (currentUserId, targetUserId) => {
  let follows = getFollows();
  const exists = follows.some((f) => f && f.followerId === currentUserId && f.followingId === targetUserId);

  if (exists) {
    follows = follows.filter((f) => f && !(f.followerId === currentUserId && f.followingId === targetUserId));
  } else {
    follows.push({ followerId: currentUserId, followingId: targetUserId, date: new Date().toISOString() });
  }

  localStorage.setItem(STORAGE_FOLLOWS_KEY, JSON.stringify(follows));
  return !exists;
};

export const isFollowingUser = (currentUserId, targetUserId) => {
  const follows = getFollows();
  return follows.some((f) => f && f.followerId === currentUserId && f.followingId === targetUserId);
};
