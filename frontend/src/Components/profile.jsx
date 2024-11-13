import React, { useState, useEffect } from "react";
import { Box, Button, TextField, Stack, Avatar, IconButton, Typography, Chip, Input } from "@mui/material";
import { Edit as EditIcon } from "@mui/icons-material";
import api from "../api/api";
import { useToast } from "../hooks/useToast";
const ProfilePage = () => {
  const [name, setName] = useState("");
  const [organisation, setOrganisation] = useState("");
  const [description, setDescription] = useState("");
  const [email, setEmail] = useState("");
  const [expertise, setExpertise] = useState([]);
  const [newExpertise, setNewExpertise] = useState("");
  const [profileImage, setProfileImage] = useState("");
  const [isEditingName, setIsEditingName] = useState(false);
  const { showToast, ToastComponent } = useToast();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await api.get("/users/profile/get-user-profile");
        const photoPath = response.data.profilePhoto;
        const fullPhotoUrl = `http://localhost:8000/${photoPath}`;
        setProfileImage(fullPhotoUrl);
        console.log(profileImage)

        setName(response.data.name);
        setDescription(response.data.description);
        setOrganisation(response.data.organisation);
        setEmail(response.data.email);
        if (Array.isArray(response.data.expertise) && response.data.expertise.length > 0) {
          const parsedExpertise = JSON.parse(response.data.expertise[0]);
          setExpertise(parsedExpertise);
        } else {
          setExpertise([]);
        }
      } catch (error) {
        showToast("Something went wrong while fetching your data. Please try again.", "error");
      }
    };

    fetchUserData();
  }, []);

  const handleUpdateProfile = async () => {
    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("organisation", organisation);
      formData.append("description", description);
      formData.append("expertise", JSON.stringify(expertise)); // Ensure expertise is serialized

      if (profileImage instanceof File) {
        formData.append("profilePhoto", profileImage);
      }
      const res = await api.post("/users/profile/update-profile", formData, { withCredentials: true });
      const photoPath = res.data.profilePhoto;
      const fullPhotoUrl = `http://localhost:8000/${photoPath}`;
      // console.log(fullPhotoUrl)
      setProfileImage(fullPhotoUrl);
      console.log(profileImage)

      console.log("Update response:", res);
      showToast("Your profile has been successfully updated", "success");
      setTimeout(() => {
        window.location.reload();
      }, 500);
    } catch (error) {
      console.log(error);
      showToast("Something went wrong while updating the profile.", "error");
    }
  };


  const handleAddExpertise = () => {
    if (newExpertise.trim() === "" || expertise.includes(newExpertise.trim())) return;
    setExpertise((prev) => [...prev, newExpertise.trim()]);
    setNewExpertise("");
  };

  const handleRemoveExpertise = (item) => {
    setExpertise((prev) => prev.filter((exp) => exp !== item));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImage(file);
      const imagePath = URL.createObjectURL(file);
      console.log(imagePath);
      setProfileImage(imagePath)
    }
  };


  return (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh" sx={{ backgroundColor: "#212121" }}>
      <Box
        p={4}
        m={6}
        width={{ xs: "80vw", md: "50vw", lg: "40vw" }}
        sx={{
          backgroundColor: "#2c2c2c",
          borderRadius: "8px",
          boxShadow: "0 4px 10px rgba(0, 0, 0, 0.2)",
        }}
      >
        <Stack spacing={3} alignItems="stretch" width="100%">
          {/* Profile Image Section */}
          {/* <img src=`http://localhost:8000/${profileImage}` /> */}
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            sx={{
              border: "2px solid #1976d2",
              borderRadius: "8px",
              padding: 2,
              width: "100%",
              marginBottom: 3,
            }}
          >
            <Avatar
              name={name}
              src={profileImage || "/default-avatar.png"}
              sx={{ width: 150, height: 150, marginBottom: 2 }}
            />
            <Input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              sx={{ width: "100%", marginBottom: 1 }}
            />
          </Box>

          {/* Name Section */}
          <Box>
            <Typography variant="h6" color="white">
              Name
            </Typography>
            {isEditingName ? (
              <TextField
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name"
                variant="outlined"
                fullWidth
                color="primary"
                sx={{ marginBottom: 2 }}
              />
            ) : (
              <Box display="flex" alignItems="center" color="white">
                <Typography variant="body1" sx={{ flexGrow: 1 }}>{name}</Typography>
                <IconButton
                  size="small"
                  color="primary"
                  onClick={() => setIsEditingName(true)}
                >
                  <EditIcon /> {/* Place the icon directly inside IconButton */}
                </IconButton>
              </Box>
            )}
          </Box>
          {/* Organisation Section */}
          <Box>
            <Typography variant="h6" color="white">Organisation/University</Typography>
            <TextField
              value={organisation}
              onChange={(e) => setOrganisation(e.target.value)}
              placeholder="Enter your organization or university"
              variant="outlined"
              fullWidth
              color="primary"
              sx={{ marginBottom: 2 }}
            />
          </Box>

          {/* Description Section */}
          <Box>
            <Typography variant="h6" color="white">Describe Yourself</Typography>
            <TextField
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Tell us about yourself"
              variant="outlined"
              fullWidth
              color="primary"
              multiline
              rows={4}
              sx={{ marginBottom: 2 }}
            />
          </Box>
          {/* Expertise Section */}
          {expertise.length > 0 && (
            <Box>
              <Typography variant="h6" color="white">
                Expertise
              </Typography>
              <Box display="flex" flexWrap="wrap" gap={1}>
                {expertise.map((item, index) => (
                  <Chip
                    label={item}
                    onDelete={() => handleRemoveExpertise(item)}
                    key={index}
                    color="primary"
                    sx={{ marginBottom: 1 }}
                  />
                ))}
              </Box>
            </Box>
          )}

          {/* Add New Expertise */}
          <Box>
            <Typography variant="h6" color="white">
              Add New Expertise
            </Typography>
            <TextField
              value={newExpertise}
              onChange={(e) => setNewExpertise(e.target.value)}
              placeholder="Enter new expertise"
              variant="outlined"
              fullWidth
              color="primary"
              sx={{ marginBottom: 2 }}
            />
            <Button
              variant="contained"
              color="primary"
              fullWidth
              onClick={handleAddExpertise}
              disabled={newExpertise.trim() === "" || expertise.includes(newExpertise.trim())}
            >
              Add Expertise
            </Button>
          </Box>

          {/* Update Profile Button */}
          <Button
            variant="contained"
            className="bg-yellow-500"
            fullWidth
            onClick={handleUpdateProfile}
            sx={{ marginTop: 2 }}
          >
            Update Profile
          </Button>
        </Stack>
      </Box>
      {ToastComponent}
    </Box>
  );
};

export default ProfilePage;
