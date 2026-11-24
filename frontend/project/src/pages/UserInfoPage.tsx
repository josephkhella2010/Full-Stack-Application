import { useEffect } from "react";
import { useParams, Navigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import type { RootState, AppDispatch } from "../store/store";

export default function UserInfoPage() {
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch<AppDispatch>();

  // Get logged-in user and Firebase token
  const { userStoraged, token } = useSelector(
    (state: RootState) => state.userSlice.userStore,
  );

  // Get profile fetched from the backend
  const user = useSelector((state: RootState) => state.userSlice.user);
  console.log("userStoraged", userStoraged);
  console.log("user", user);
  // Get loading and error states
  /*  const { isLoading, error } = useSelector(
    (state: RootState) => state.loadingErrorSlice,
  ); */

  // Fetch the logged-in user's profile
  useEffect(() => {
    if (id && token && userStoraged?.firebaseUid === id) {
      dispatch({
        type: "FETCH_USER_BY_ID",
        payload: {
          uid: id,
        },
      });
    }
  }, [id, token, userStoraged?.firebaseUid, dispatch]);

  // Check authentication
  if (!token || !userStoraged || userStoraged.firebaseUid !== id) {
    return <Navigate to="/login" replace />;
  }

  // Show loading
  /*   if (isLoading) {
    return <p>Loading user information...</p>;
  }

  // Show error
  if (error) {
    return <p>{error}</p>;
  }

  // Prevent accessing properties of null
  if (!user) {
    return <p>No user information found.</p>;
  }
 */
  // Display user information
  return (
    <div>
      <h1>User Information</h1>

      <p>
        <strong>First name:</strong> {user?.firstname}
      </p>

      <p>
        <strong>Last name:</strong> {user?.lastname}
      </p>

      <p>
        <strong>Username:</strong> {user?.username}
      </p>

      <p>
        <strong>Email:</strong> {user?.email}
      </p>

      <p>
        <strong>Created:</strong> {user?.createdAt}
      </p>

      <p>
        <strong>Updated:</strong> {user?.updatedAt}
      </p>
    </div>
  );
}
