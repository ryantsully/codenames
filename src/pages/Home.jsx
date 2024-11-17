
import BlogList from './BlogList';
import useFetch from './useFetch';

const Home = () => {
    const { data: blogs, isPending, error } = useFetch('http://localhost:8000/blogs');

    return (
    <div>
    <h1>Home</h1>    
    { error && <div>{ error }</div>}
    { isPending && <div>Loading Entries...</div>}
    {/* This blogs && says validate the left before the right. So, it does not output the second part unless the left part = true */}
    {blogs && <BlogList blogs={blogs} title=""/>}    
    </div>
    );
};

export default Home;