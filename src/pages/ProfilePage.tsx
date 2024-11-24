import  { useEffect, useState } from 'react';
import axios from 'axios';
import { Camera, UserPlus2, Link as LinkIcon, Save, Pencil, X } from 'lucide-react';
import { useParams } from 'react-router-dom';

interface User {
  _id: string;
  name: string;
  email: string;
  ImageURL: string;
}

const ProfilePage = () => {
  const { id } = useParams();
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [uploadStatus, setUploadStatus] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState('');
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
        const { password, ...data } = response.data.user;
        setUser(data);
        setName(data.name);
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
        showNotification('Profile picture updated successfully!', 'success');
      } else {
        setUploadStatus('Upload failed.');
        showNotification('Failed to update profile picture.', 'error');
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      setUploadStatus('Upload failed.');
      showNotification('Failed to update profile picture.', 'error');
    } finally {
      setIsUploading(false);
    }
  };

  const handleNameChange = async () => {
    if (!user || !name.trim()) return;

    try {
      const updatedUser = { ...user, name } as User;
      await axios.put(`http://localhost:5000/api/user/${user._id}`, updatedUser, {
        withCredentials: true,
      });
      setUser(updatedUser);
      setIsEditing(false);
      showNotification('Name updated successfully!', 'success');
    } catch (error) {
      console.error('Error updating name:', error);
      showNotification('Failed to update name.', 'error');
    }
  };

  const handleAddFriend = () => {
    showNotification('Friend request sent!', 'success');
  };

  const handleCopyLink = () => {
    const profileLink = `${window.location.origin}/profile/${id}`;
    navigator.clipboard.writeText(profileLink)
      .then(() => {
        showNotification('Profile link copied!', 'success');
      })
      .catch(() => {
        showNotification('Failed to copy link.', 'error');
      });
  };

  const showNotification = (message: string, type: 'success' | 'error') => {
    const notification = document.getElementById('notification');
    if (notification) {
      notification.textContent = message;
      notification.className = `fixed bottom-4 right-4 px-6 py-3 rounded-lg shadow-lg transform transition-all duration-500 ${
        type === 'success' ? 'bg-emerald-500' : 'bg-red-500'
      } text-white`;
      setTimeout(() => {
        notification.className = 'opacity-0 pointer-events-none';
      }, 3000);
    }
  };

  useEffect(() => {
    setImgUrl(user?.ImageURL);
  }, [user?.ImageURL]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="h-64 bg-[url('https://images.unsplash.com/photo-1579547621113-e4bb2a19bdd6')] bg-cover bg-center">
        <div className="h-full w-full bg-black bg-opacity-50">
          <div className="max-w-5xl mx-auto px-4 h-full flex items-end">
            <div className="pb-6 flex items-end space-x-6">
              {/* Profile Picture */}
              <div className="relative">
                <div className="w-32 h-32 rounded-full border-4 border-white shadow-xl overflow-hidden bg-white">
                  {imagePreview || imgUrl ? (
                    <img
                      src={imagePreview || imgUrl}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-100">
                      <Camera className="w-10 h-10 text-gray-400" />
                    </div>
                  )}
                  <label
                    htmlFor="image-upload"
                    className="absolute bottom-0 right-0 p-2 bg-blue-600 rounded-full cursor-pointer hover:bg-blue-700 transition-colors shadow-lg"
                  >
                    <Camera className="w-4 h-4 text-white" />
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
              
              {/* Name and Email */}
              <div className="mb-4">
                <div className="flex items-center space-x-3">
                  {isEditing ? (
                    <div className="flex items-center space-x-2">
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="px-3 py-2 bg-white/90 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <button
                        onClick={handleNameChange}
                        className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        <Save className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => {
                          setIsEditing(false);
                          setName(user?.name || '');
                        }}
                        className="p-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                  ) : (
                    <>
                      <h1 className="text-3xl font-bold text-white">{user?.name}</h1>
                      <button
                        onClick={() => setIsEditing(true)}
                        className="p-2 text-white/80 hover:text-white transition-colors"
                      >
                        <Pencil className="w-5 h-5" />
                      </button>
                    </>
                  )}
                </div>
                <p className="text-gray-200 mt-1">{user?.email}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Left Column */}
          <div className="w-full md:w-1/3">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Actions</h2>
              </div>
              
              <div className="space-y-4">
                <button
                  onClick={handleAddFriend}
                  className="w-full flex items-center justify-center px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
                >
                  <UserPlus2 className="w-5 h-5 mr-2" />
                  Add Friend
                </button>
                
                <button
                  onClick={handleCopyLink}
                  className="w-full flex items-center justify-center px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  <LinkIcon className="w-5 h-5 mr-2" />
                  Share Profile
                </button>

                {selectedImage && (
                  <button
                    onClick={handleImageUpload}
                    disabled={isUploading}
                    className="w-full flex items-center justify-center px-4 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                  >
                    {isUploading ? 'Uploading...' : 'Save Profile Image'}
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="w-full md:w-2/3">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">About</h2>
              <p className="text-gray-600">
                This is where your bio would go. Add information about yourself, your interests, and what you're working on.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Notification */}
      <div
        id="notification"
        className="opacity-0 pointer-events-none"
      ></div>
    </div>
  );
};

export default ProfilePage;