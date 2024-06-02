import { Card, Pagination, PopularPosts, PopularWriters } from "../components";
import { usePopularPost, usePosts } from "../hooks/post_hooks";
import { CATEGORIES } from "../utils/dummyData";

const CategoryPage = () => {
  const query = new URLSearchParams(window.location.search).get("cat");
  const category = CATEGORIES.find((cat) => cat._id === query);
  const label = category ? category.label : "";

  const { posts, numOfPages, setPage } = usePosts({
    writerId: "",
  });
  const popular = usePopularPost();
  const handlePageChange = (page) => {
    setPage(page);
  };

  return (
    <div className="px-0 2xl:px-20">
      <div className="py-5">
        <h2 className="text-4xl 2xl:text-5xl font-semibold text-slate-800 dark:text-white">
          {label}
        </h2>
      </div>

      <div className="w-full flex flex-col md:flex-row gap-10 2xl:gap-20">
        {/* LEFT */}
        <div className="w-full md:w-2/3 flex flex-col gap-y-28 md:gap-y-14">
          {posts?.length === 0 ? (
            <div className="w-full h-full py-8 flex  justify-center">
              <span className="text-lg text-slate-500">
                Không có bài viết nào cho danh mục này
              </span>
            </div>
          ) : (
            <>
              {posts?.map((post) => (
                <Card key={post?._id} post={post} />
              ))}

              <div className="w-full flex items-cemter justify-center">
                <Pagination
                  totalPages={numOfPages}
                  onPageChange={handlePageChange}
                />
              </div>
            </>
          )}
        </div>

        {/* RIGHT */}
        <div className="w-full md:w-1/4 flex flex-col gap-y-12">
          {/* POPULAR POSTS */}
          <PopularPosts posts={popular?.posts} />

          {/* POPULAR WRITERS */}
          <PopularWriters data={popular?.writers} />
        </div>
      </div>
    </div>
  );
};

export default CategoryPage;
