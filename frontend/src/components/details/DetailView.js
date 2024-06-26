import { Box, Typography, styled } from "@mui/material";
import { useState, useEffect, useContext } from "react";
import { DataContext } from "../../context/DataProvider";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { getAccessToken } from "../../utils/commonUtils";
import { Delete, Edit } from "@mui/icons-material";
import Comments from "./comments/Comments";

const Container = styled(Box)(({ theme }) => ({
  margin: "50px 100px",
  [theme.breakpoints.down("md")]: {
    margin: 0,
  },
}));

const Image = styled("img")({
  width: "100%",
  height: "50vh",
  objectFit: "cover",
});

const EditIcon = styled(Edit)`
  margin: 5px;
  padding: 5px;
  border: 1px solid #878787;
  border-radius: 10px;
  cursor: pointer;
`;

const DeleteIcon = styled(Delete)`
  margin: 5px;
  padding: 5px;
  border: 1px solid #878787;
  border-radius: 10px;
  cursor: pointer;
`;

const Heading = styled(Typography)`
  font-size: 38px;
  font-weight: 600;
  text-align: center;
  margin: 50px 0 10px 0;
  word-break: break-word;
`;

const Author = styled(Box)(({ theme }) => ({
  color: "#878787",
  display: "flex",
  margin: "20px 0",
  [theme.breakpoints.down("sm")]: {
    display: "block",
  },
}));

const DetailView = () => {
  const [post, setPost] = useState({});

  const { id } = useParams();

  const { account } = useContext(DataContext);

  const navigate = useNavigate();

  const url =
    "https://images.unsplash.com/photo-1543128639-4cb7e6eeef1b?ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8bGFwdG9wJTIwc2V0dXB8ZW58MHx8MHx8&ixlib=rb-1.2.1&w=1000&q=80";

  useEffect(() => {
    const fetchData = async () => {
      const params = {
        id: id,
      };
      const config = {
        headers: {
          Authorization: `${getAccessToken()}`,
        },
        params,
      };
      try {
        const response = await axios.get(`/post/${id}`, config); // API call
        // console.log(response);
        if (response.data) {
          setPost(response.data);
        }
      } catch (error) {
        console.error("Error fetching post:", error); // Handle errors
      }
    };
    fetchData();
  }, [id]);

  const deleteBlog = async () => {
    const params = {
      id: id,
    };
    const config = {
      headers: {
        Authorization: `${getAccessToken()}`,
      },
      params,
    };
    const response = await axios.delete(`/delete/${id}`, config); //API Call
    // console.log(response);
    if (response.status === 200) {
      navigate("/");
    } else {
      console.log("Could not delete post");
    }
  };
  return (
    <Container>
      <Image src={post.picture || url} alt="blog" />

      <Box sx={{ float: "right" }}>
        {account.username === post.username && (
          <>
            <Link to={`/update/${post._id}`}>
              <EditIcon color="primary" />
            </Link>
            <DeleteIcon onClick={() => deleteBlog()} color="error" />
          </>
        )}
      </Box>

      <Heading>{post.title}</Heading>
      <Author>
        <Typography>
          Author:{" "}
          <Box component="span" sx={{ fontWeight: 600 }}>
            {post.username}
          </Box>
        </Typography>
        <Typography sx={{ marginLeft: "auto" }}>
          {new Date(post.createdAt).toDateString()}
        </Typography>
      </Author>
      <Typography sx={{ wordBreak: "break-word" }}>
        {post.description}
      </Typography>

      <Comments post={post} />
    </Container>
  );
};

export default DetailView;
