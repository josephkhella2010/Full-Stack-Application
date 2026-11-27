import { useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import type { AppDispatch, RootState } from "../store/store";
import type { UserType } from "../utilities/interfaces";

interface UpdateFormType {
  firstname: string;
  lastname: string;
  username: string;
  email: string;
}

export default function UpdateUserPage() {
  const { id } = useParams<{ id: string }>();

  const dispatch = useDispatch<AppDispatch>();

  const user = useSelector(
    (state: RootState) => state.userSlice.userStore.userStoraged,
  );

  const [formData, setFormData] = useState<UpdateFormType | null>(() => {
    if (!user || user.firebaseUid !== id) {
      return null;
    }

    return {
      firstname: user.firstname,
      lastname: user.lastname,
      username: user.username,
      email: user.email,
    };
  });

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData((previous) =>
      previous
        ? {
          ...previous,
          [name]: value,
        }
        : previous,
    );
  };

  // Submit updated user information
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!id || !user || !formData || user.firebaseUid !== id) {
      return;
    }

    const updatedUserData: UserType = {
      ...user,
      ...formData,
    };

    dispatch({
      type: "FETCH_UPDATE_USER",
      payload: {
        id,
        data: updatedUserData,
      },
    });
  };

  // Check user information
  if (!id) {
    return <p>Invalid user ID.</p>;
  }

  if (!user || user.firebaseUid !== id) {
    return <p>User information is not available.</p>;
  }

  if (!formData) {
    return <p>Loading user information...</p>;
  }

  return (
    <div className="update-user-container">
      <h2>Update Your Profile</h2>

      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="firstname">First Name</label>
          <input
            id="firstname"
            name="firstname"
            type="text"
            value={formData.firstname}
            onChange={handleChange}
            required
            minLength={2}
            maxLength={255}
          />
        </div>

        <div>
          <label htmlFor="lastname">Last Name</label>
          <input
            id="lastname"
            name="lastname"
            type="text"
            value={formData.lastname}
            onChange={handleChange}
            required
            minLength={2}
            maxLength={255}
          />
        </div>

        <div>
          <label htmlFor="username">Username</label>
          <input
            id="username"
            name="username"
            type="text"
            value={formData.username}
            onChange={handleChange}
            required
            minLength={2}
          />
        </div>

        <div>
          <label htmlFor="email">Email</label>
          <input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <button type="submit">Save Changes</button>
      </form>
    </div>
  );
}
