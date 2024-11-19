import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Form, Input, Button, message, Spin } from 'antd';
import { CopyOutlined, UserAddOutlined } from '@ant-design/icons';
import { useParams } from 'react-router-dom';


interface User {
  _id: string;
  name: string;
  email: string;
  ImageURL: string;
}
const ProfilePage = () => {
  const {id} = useParams();
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [uploadStatus, setUploadStatus] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [user, setUser] = useState<User|null>(null);
  const [loading, setLoading] = useState(true);
  //to do fetch user from database instead

  const [form] = Form.useForm();
  const [imgUrl, setImgUrl] = useState<string | undefined>();

  
  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedImage(event.target.files[0]);
      setImagePreview(URL.createObjectURL(event.target.files[0]));
    }
  };
useEffect(() => {
  const fetchUser = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:5000/api/user/${id}`, {
        withCredentials: true,
      });
       // eslint-disable-next-line @typescript-eslint/no-unused-vars
       const {password,...data} = response.data.user;
      setUser(data);
    } catch (error) {
      console.error('Error fetching user:', error);
    } finally {
      setLoading(false);
    }
  };
  fetchUser();
}, [id]);
  const handleImageUpload = async () => {
    if (!selectedImage) return;

    const formData = new FormData();
    formData.append('file', selectedImage);
    setIsUploading(true);

    try {
      const response = await axios.post(
        'http://localhost:5000/api/uploadImage',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          withCredentials: true,
        }
      );

      if (response.data.success) {
        setUploadStatus('Upload successful!');
        setImgUrl(response.data.filePath);
        console.log('File uploaded to cloud server:', response.data.filePath);
      } else {
        setUploadStatus('Upload failed.');
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      setUploadStatus('Upload failed.');
    } finally {
      setIsUploading(false);
    }
  };

 
  const handleNameChange = async (values: { name: string }) => {
    try {
      const updatedUser = { ...user, name: values.name } as User; // Update the name locally
      await axios.put(`http://localhost:5000/api/user/${user?._id}`, updatedUser, {
        withCredentials: true,
      });
      setUser(updatedUser); // Update the user state with the new name
      message.success('Name updated successfully!');
    } catch (error) {
      console.error('Error updating name:', error);
      message.error('Failed to update name.');
    }
  };
  

    
  useEffect(() => {
    if (user) {
      form.setFieldsValue({ name: user.name });
    }
  }, [user, form]);
  
  const handleAddFriend = () => {
    message.success('Friend request sent!');
  };

  const handleCopyLink = () => {
    const profileLink = `${window.location.origin}/profile/${id}`;
    navigator.clipboard.writeText(profileLink)
      .then(() => {
        message.success('Profile link copied to clipboard!');
      })
      .catch(() => {
        message.error('Failed to copy profile link.');
      });
  };

    useEffect(() => {
      setImgUrl(user?.ImageURL);
    }, [user?.ImageURL]);
  
  return (
    <div className="profile-page p-6 max-w-lg mx-auto bg-gradient-to-br from-blue-100 to-blue-300 shadow-2xl rounded-lg space-y-6">
      <h1 className="text-4xl font-bold text-center text-gray-800">Your Profile</h1>
      {loading ? (
        <div className="flex justify-center items-center h-full">
          <Spin size="large" />
        </div>
      ) : (
        <>
             <div className="text-center">
        <div className="flex flex-col items-center space-y-2">
          <div className="w-32 h-32 rounded-full bg-gray-200 overflow-hidden shadow-md">
            {imagePreview || imgUrl ? (
              <img
                alt="Profile"
                loading='lazy'
                src={imagePreview || imgUrl}
                className="w-full h-full object-cover"
              />
            ) : (
              <p className="text-gray-500 text-sm flex items-center justify-center h-full">
                No Image
              </p>
            )}
          </div>

          <label
            htmlFor="image-upload"
            className="text-blue-500 underline cursor-pointer hover:text-blue-700"
          >
            {imagePreview ? 'Change Image' : 'Upload Image'}
          </label>
          <input
            id="image-upload"
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="hidden"
          />
        </div>
      </div>

      <Form
        form={form}
        layout="vertical"
        initialValues={{
          name: user?.name || 'John Doe',
        }}
        onFinish={handleNameChange}
        className="space-y-4"
      >
        <Form.Item
          name="name"
          label="Name"
          rules={[{ required: true, message: 'Please enter your name!' }]}
        >
          <Input
            placeholder="Enter your name"
            className="w-full border border-gray-300 rounded-lg p-2"
          />
        </Form.Item>

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg shadow-md hover:bg-blue-700"
          >
            Save Name
          </Button>
        </Form.Item>
      </Form>

      <div className="flex justify-around mt-4">
        <Button
          type="default"
          icon={<UserAddOutlined />}
          onClick={handleAddFriend}
          className="flex items-center justify-center text-blue-600 border border-blue-600 hover:bg-blue-100"
        >
          Add Friend
        </Button>
        <Button
          type="default"
          icon={<CopyOutlined />}
          onClick={handleCopyLink}
          className="flex items-center justify-center text-blue-600 border border-blue-600 hover:bg-blue-100"
        >
          Copy Link
        </Button>
      </div>

      <div className="text-center">
        <button
          onClick={handleImageUpload}
          className={`mt-4 w-full bg-blue-600 text-white py-2 px-4 rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all ${
            isUploading ? 'opacity-70 cursor-not-allowed' : ''
          }`}
          disabled={isUploading}
        >
          {isUploading ? 'Uploading...' : 'Save Profile Image'}
        </button>
      </div>

      {uploadStatus && (
        <div
          className={`mt-4 text-center p-2 rounded-lg ${
            uploadStatus === 'Upload successful!' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
          }`}
        >
          {uploadStatus}
        </div>
      )}</>
      )}
 
    </div>
  );
};

export default ProfilePage;
