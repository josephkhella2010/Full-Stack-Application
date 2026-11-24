import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../../store/store";

export default function HomePage() {
  const { users } = useSelector((state: RootState) => state.userSlice);
  console.log("user", users);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch({ type: "FETCH_ALL_USERS" });
  }, [dispatch]);
  return <div>HomePage</div>;
}
