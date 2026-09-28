import type { RecognitionDto  } from "../../api/recognition";
import "./FeedPost.css";

type Props = {post: RecognitionDto};

function formatDate(iso: string){
    try{
        return new Date(iso).toLocaleString("en-GB", {
      day: "numeric",
      month: "long",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return iso;
  }
}

export default function FeedPost({post}: Props){
    const giver = post.giverUsername ?? "Someone";
    const receiver = post.receiverUsername ?? "Someone";
    const quality = post.qualityUsername ?? post.qualityCode ?? "Thank you";
    const initial = giver.charAt(0).toUpperCase();

    return (
    <article className="feed-post">
      <header className="feed-post-header">
        <div className="feed-post-avatar">{initial}</div>
        <div>
          <div className="feed-post-author">{giver}</div>
          <div className="feed-post-date">{formatDate(post.createdAt)}</div>
        </div>
      </header>

      <p className="feed-post-message">{post.message}</p>

      <footer className="feed-post-footer">
        <span className="feed-post-pair">
          {giver} → {receiver}
        </span>
        <span className="feed-post-quality">{quality}</span>
      </footer>
    </article>
  );
}
