import "../styles/global.css";
import "../styles/posts.css";
import { useEffect, useState } from "react";
import Chip from "@mui/material/Chip";
import { styled } from "@mui/system";

// const ChipUnselected = styled(Chip)`
//   margin: 5px;
//   background-color: #d3d3d3;
//   font-size: 18px;

//   @media (max-width: 720px) {
//     margin: 5px;
//     background-color: #d3d3d3;
//     font-size: 14px;
//   }
// `;
const ChipUnselected = styled(Chip)({
  margin: "5px",
  backgroundColor: "#D3D3D3",
  // fontSize: "18px"
  fontSize: "18px",
});

const ChipSelected = styled(Chip)({
  margin: "5px",
  color: "#D3D3D3",
  backgroundColor: "black",
  // fontSize: "18px"
  fontSize: "18px",
});

interface PostProps {
  posts: any[];
  tags: any[];
}
const PostSection = (props: PostProps) => {
  const { posts, tags } = props;

  const [showDark, setShowDark] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [filteredPosts, setFilteredPosts] = useState(posts);
  const [selectedTag, setSelectedTag] = useState("");

  const handleInputChange = (event) => {
    setSelectedTag("");
    const newInputValue = event.target.value;
    setInputValue(newInputValue);

    const filteredResults = posts.filter((value) =>
      value.data.title.toLowerCase().includes(newInputValue.toLowerCase()),
    );
    setFilteredPosts(filteredResults);
  };

  const handleSelectedTag = (tag: string) => {
    if (tag === selectedTag) {
      setSelectedTag("");
      setFilteredPosts(posts);
    } else {
      setSelectedTag(tag);
    }
  };

  useEffect(() => {
    setShowDark(document.documentElement.classList.contains("dark"));
  }, []);

  useEffect(() => {
    if (selectedTag !== "") {
      setInputValue("");

      const filteredResults = posts.filter((value) =>
        value.data.tags.includes(selectedTag.toLowerCase()),
      );
      setFilteredPosts(filteredResults);
    }
  }, [selectedTag]);

  return (
    <section>
      <div className="search">
        <input
          type="text"
          placeholder="Search..."
          value={inputValue}
          onChange={handleInputChange}
        />
      </div>
      <div className="tags">
        {tags.map((value) =>
          value === selectedTag ? (
            <ChipSelected
              label={value}
              variant="outlined"
              onClick={() => handleSelectedTag(value)}
              key={value}
            />
          ) : (
            <ChipUnselected
              label={value}
              variant="outlined"
              onClick={() => handleSelectedTag(value)}
              key={value}
            />
          ),
        )}
      </div>
      <ul>
        {filteredPosts.map((post, postIndex) => (
          <li key={postIndex}>
            <a href={`/blog/${post.slug}/`}>
              <h4 className={showDark ? "dark-title" : "title"}>
                {post.data.title}
              </h4>
            </a>
            <p className={showDark ? "dark-date" : "date"}>
              {`Posted on ${post.data.pubDate.toLocaleDateString("en-us", {
                year: "numeric",
                month: "short",
                day: "numeric",
              })}`}
            </p>
            <p className={showDark ? "dark-snippet" : "snippet"}>
              {`${post.data?.snippet}...`}
              <a
                href={`/blog/${post.slug}/`}
                className={showDark ? "continue-link-dark" : "continue-link"}
              >
                [continue reading]
              </a>
            </p>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default PostSection;
