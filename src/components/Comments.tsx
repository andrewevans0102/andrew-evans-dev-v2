import Giscus from '@giscus/react';

const Comments = () => {
    return (
        <Giscus
            id="comments"
            repo="andrewevans0102/andrew-evans-dev-v2"
            repoId="R_kgDOKHVL9w"
            category="Announcements"
            categoryId="DIC_kwDOKHVL984CYnpA"
            mapping="og:title"
            // term="Welcome to @giscus/react component!"
            reactionsEnabled="1"
            emitMetadata="0"
            inputPosition="bottom"
            theme="preferred_color_scheme"
            lang="en"
            loading="lazy"
        />
    );
  }

  export default Comments;