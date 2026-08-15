# 🌉 Post Bridge
 
Ever wished you could write **one post** and send it flying to YouTube, LinkedIn, and Instagram at the same time — without opening three different apps? That's exactly what **Post Bridge** does.
 
**The problem:** if you've ever tried posting the same video to YouTube, Instagram, and LinkedIn, you know the drill — upload the file, write the caption, hit publish... then do it all over again on the next platform, and the next. It's the same video, three separate uploads, three times the effort.
 
**The fix:** Post Bridge lets you upload the video **once**, pick every platform you want it on, and publish (or schedule) to all of them in a single action — no re-uploading, no repeating yourself.
 
It's a MERN-stack app where you create a post once, pick where it should go, and either publish it instantly or schedule it for later. A built-in calendar and history log keep track of everything so you always know what's live, what's queued, and what's already gone out.
 
Below is a quick visual tour of the app in its current state.
 
> ⚠️ **Still a work in progress** — there's no public live demo yet, so the screenshots below show the real, working flow. A hosted link and video walkthrough will be added once deployment is finalized.
 
**Built with:** React 19 + Vite + Tailwind CSS on the frontend · Express 5 + MongoDB (Mongoose) + JWT auth + Cloudinary + Multer on the backend
 
---
---

## 1. Authentication

## landing page


https://github.com/user-attachments/assets/873a8113-3e7d-4eb9-bfa5-a6d4a8189296


### Sign Up Page
![alt text](All%20photos/image-1.png)

### Login Page
![alt text](All%20photos/image-2.png)

---

## 2. Create a New Post
Choose between a Text, Image, or Video post — each mapped to the platforms that support it (LinkedIn only for text; Instagram/LinkedIn/YouTube for image; YouTube/Instagram/LinkedIn for video).

![alt text](All%20photos/image-3.png)
---

## 3. Create Video Post — Select Account & Upload Media
Pick the connected account(s) to post to and drag & drop the video file.

![alt text](All%20photos/image-4.png)

---

## 4. Create Video Post — Caption, Platform Settings & Scheduling
Set a main caption, configure platform-specific fields (e.g. YouTube title & thumbnail), and either publish now or schedule for later.

![alt text](All%20photos/image-5.png)
![alt text](All%20photos/image-6.png)

---

## 5. Calendar View
A calendar of all scheduled and published posts, with details for the selected day shown alongside.

![alt text](All%20photos/image-7.png)

---

## 6. All Posts
A unified view of every draft, scheduled, and published post.

![alt text](All%20photos/image-8.png)

---

## 7. Scheduled Posts
Posts queued for automatic publishing at their scheduled time.

![alt text](All%20photos/image-9.png)

---

## 8. Posted History
History of posts successfully published across connected platforms.

![alt text](All%20photos/image-10.png)

---

## 9. Connected Accounts
Manage YouTube, LinkedIn, and Instagram connections from one place.

![alt text](All%20photos/image-11.png)

---

## 10. Connect YouTube — OAuth Confirmation
A confirmation modal before redirecting to Google OAuth to link a YouTube channel.

![alt text](All%20photos/image-12.png)
---

## Notes for reviewers
- The app currently supports posting Text, Image, and Video content, each routed to the platforms it's compatible with.
- Posts can be scheduled ahead of time or published immediately, and their status (scheduled/posted) is tracked across the Calendar, All Posts, Scheduled, and Posted History views.
- Account connections use OAuth (currently YouTube is wired up; LinkedIn and Instagram are next).
