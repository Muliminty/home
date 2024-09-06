import MarkdownRenderer from './MarkdownRenderer'


const Blog = () => {
    return <div style={{padding:'24px'}}>
        <MarkdownRenderer path={`/1.md`} />;
    </div>
};

export default Blog;
