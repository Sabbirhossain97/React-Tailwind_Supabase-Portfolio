import React from "react";
import { useEffect, useState, useRef } from "react";
import { portfolioClient } from "../../../portfolioClient";
import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";
import AnimatedPage from "../../AnimatedPages";

export default function AddProject({ session, funcTopNav }) {
  funcTopNav(false);
  const params = useParams();
  const formData = useRef();
  const [title, setTitle] = useState("");
  const [githubLink, setGithubLink] = useState(" ");
  const [liveLink, setLiveLink] = useState("");
  const [updateImage, setUpdateImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [sendImage, setSendImage] = useState(null);
  const date = new Date().toLocaleDateString();
  
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (params.id === "addproject") {
      createProjects(e);
    } else {
      updateProject(e);
    }
  };

  const downloadImage = async (path) => {
    try {
      const { data, error } = await portfolioClient.storage
        .from("projects")
        .download(`Thumbnail/${path}`);
      if (error) {
        throw error;
      }
      setPreviewImage(URL.createObjectURL(data));
    } catch (error) {
      console.log("Error downloading image: ", error.message);
    }
  };

  const createProjects = async (e) => {
    e.preventDefault();

    const { data, error } = await portfolioClient
      .from("projects")
      .insert({
        user_id: session.user.id,
        title: title,
        image: sendImage,
        githublink: githubLink,
        livelink: liveLink,
        inserted_at: date,
      })
      .single();
  };

  //when updating project fields will be pre-loaded
  const loadBlogContent = async (e) => {
    try {
      let { data, error } = await portfolioClient
        .from("projects")
        .select("*")
        .match({ id: params.id });
      if (error) {
        console.log(error);
      } else {
        // setPreviewImage(URL.createObjectURL(data[0].image));
        setUpdateImage(data[0].image);
        setTitle(data[0].title);
        setGithubLink(data[0].githublink);
        setLiveLink(data[0].livelink);
       
      }
    } catch (error) {
      console.log(error);
    }
  };

  //to update a project
  const updateProject = async (e) => {
    const { imageData, imageError } = await portfolioClient
      .from("projects")
      .update(`Thumbnail/${updateImage}`, sendImage, {
        cacheControl: "3600",
        upsert: true,
      });
    if (imageError) {
      console.log(imageError);
    } else {
      setUpdateImage(imageData);
      console.log(imageData);
    }

    const { data, error } = await portfolioClient
      .from("projects")
      .update({
        user_id: session.user.id,
        title: title,
        image: sendImage,
        githublink: githubLink,
        livelink: liveLink,
        inserted_at: date,
      })
      .match({ id: params.id });
  };

  const uploadImage = async (e) => {
    if (!e.target.files || e.target.files.length === 0) {
      throw new Error("You must select an image to upload.");
    }

    const file = e.target.files[0];
    const fileExt = file.name.split(".").pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = `${fileName}`;
    if (params.id === "addproject") {
      let { error: uploadError } = await portfolioClient.storage
        .from("projects")
        .upload("Thumbnail/" + filePath, file);

      if (uploadError) {
        console.log(uploadError);
      } else {
        downloadImage(filePath);
        setPreviewImage(filePath);
        setSendImage(filePath);
      }
    } else {
      loadBlogContent()
    }
  };
  useEffect(() => {
    if (params.id !== "undefined") {
      loadBlogContent();
    }
  }, []);
  return (
    <AnimatedPage>
      <div>
        <h1 className="mt-[50px] p-5 flex justify-center text-gray-300 text-2xl items-center">
          Add Your Project Details
        </h1>
        <div
          className={`mx-auto ring-1 p-6 mt-[0px] rounded-lg w-2/3 sm:w-2/3 md:w-1/2 lg:w-1/3`}
        >
          <form ref={formData} onSubmit={handleSubmit}>
            <div className="mb-6">
              <label
                htmlFor="title"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"
              >
                Title
              </label>
              <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                required
              />
            </div>

            <div className="mb-6">
              <label
                htmlFor="github"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"
              >
                Github link
              </label>
              <input
                type="text"
                id="github"
                value={githubLink}
                onChange={(e) => setGithubLink(e.target.value)}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                required
              />
            </div>
            <div className="mb-6">
              <label
                htmlFor="live"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"
              >
                Live link
              </label>
              <input
                type="text"
                id="live"
                value={liveLink}
                onChange={(e) => setLiveLink(e.target.value)}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                required
              />
            </div>
            <div className="mb-6">
              {/* <label htmlFor="imageUrl" className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">Image URL</label>
                            <input type="text" id="text" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required /> */}
              {/* "https://i.imgur.com/W2AT377.jpg" */}
              <div>
                {previewImage ? (
                  <img
                    src={
                      previewImage
                        ? previewImage
                        : "https://i.imgur.com/W2AT377.jpg"
                    }
                    alt=""
                    className="mx-auto avatar image ring-1 flex justify-center"
                    style={{ width: "400px", height: "200px" }}
                  />
                ) : (
                  <div className=" sm:border-gray-200 sm:pt-5">
                    <div className="mt-1 sm:mt-0">
                      <div className="flex w-full justify-center rounded-md border-2 border-dashed border-gray-300 px-6 pt-5 pb-6">
                        <div className="space-y-1 text-center">
                          <svg
                            className="mx-auto h-12 w-12 text-gray-400"
                            stroke="currentColor"
                            fill="none"
                            viewBox="0 0 48 48"
                            aria-hidden="true"
                          >
                            <path
                              d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                          <label
                            htmlFor="file-upload"
                            className="relative  rounded-md font-medium text-blue-700 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-2 hover:text-indigo-500"
                          >
                            <span>Attach an image</span>
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                {/* */}

                {previewImage ? (
                  <div className="flex flex-row">
                    <button
                      onClick={() => setPreviewImage(null)}
                      className=" mt-[15px]  flex justify-center rounded-md border border-transparent bg-blue-700 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <div className="">
                    <input
                      type="file"
                      id="single"
                      accept="image/*"
                      onChange={uploadImage}
                      className=" mt-[5px] w-full block text-sm text-gray-900 bg-blue-500 rounded-lg border border-gray-300 cursor-pointer dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
                    />
                  </div>
                )}
                {/* */}
              </div>
            </div>
            <div className="flex flex-row">
              <button
                type="submit"
                className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-md text-sm sm:w-1/4  px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
              >
                Submit
              </button>

              <Link
                to="/dashboard"
                className="ml-[20px] text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-md text-sm sm:w-1/4  px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
              >
                <button type="button">Close</button>
              </Link>
            </div>
          </form>
        </div>
      </div>
    </AnimatedPage>
  );
}
