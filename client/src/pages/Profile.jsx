import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getUserPosts } from "../featchers/posts/postActions";
import Spinner from "../components/Spinner";
import Post from "../components/Post";
import Options from "../components/Options";
import Pagenation from "../components/Pagenation";
import ListItem from "../components/ListItem";
import Pcontroll from "../components/Pcontroll";
import { AiFillDelete, AiTwotoneSetting } from "react-icons/ai";
import { Outlet, useNavigate } from "react-router-dom";
import { postreset } from "../featchers/posts/postSlice";
import axios from "axios";

export default function Profile() {
  const { user } = useSelector((state) => state.auth);

  const { posts, loading } = useSelector((state) => state.posts);
  const dispatch = useDispatch();
  const [page, setPage] = useState(1);
  const navigate = useNavigate();
  useEffect(() => {
    if (!user) {
      navigate("/login");
    } else {
      dispatch(getUserPosts({ page, id: user.id }));
    }

    return () => {
      dispatch(postreset());
    };
  }, [dispatch, navigate, page, user]);

  const next = () => {
    if (page < posts.total / 4) {
      setPage(page + 1);
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  };
  const prev = () => {
    if (page > 1) {
      setPage(page - 1);
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  };

  const removeAllUserBlogs = () => {
    axios
      .delete("/api/blogs/remove/allBlogs", {
        headers: { Authorization: `Bearer ${user.token}` },
      })
      .then((res) => {
        if (res.data.acknowledged) navigate("/");
      })
      .catch((error) => console.log(error));
  };

  return (
    <>
      {user && (
        <div className="view">
          <Options>
            <ListItem
              to="/profile/setting"
              name="setting"
              icone={<AiTwotoneSetting />}
            />
            {posts.total ? (
              <ListItem
                to=""
                name="delete All posts"
                icone={<AiFillDelete />}
                fun={removeAllUserBlogs}
              />
            ) : null}
          </Options>

          <div className="view_content">
            {loading && <Spinner cls="fixed" />}

            {posts.blogs &&
              posts.blogs.map((el) => (
                <div className="box" key={el._id}>
                  <Pcontroll id={el._id} />
                  <Post {...el} />
                </div>
              ))}
            <Pagenation
              {...{ next, prev, page }}
              total={posts.total}
              per={posts.perPage}
            />
          </div>
        </div>
      )}
      <Outlet />
    </>
  );
}
