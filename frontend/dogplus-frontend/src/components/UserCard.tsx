import { PublicUser } from "../types/user";

interface UserCardProps {
  user: PublicUser;
  onFollow: (userId: string) => void;
}

const UserCard = (props: UserCardProps) => {
  return (
    <div className="flex items-center justify-between border-b p-4">
      <div className="flex items-center">
        <img
          src={props.user.profile_image}
          alt="Profile"
          className="w-10 h-10 rounded-full mr-3 object-cover"
        />
        <div>
          <h3 className="text-lg font-semibold">{props.user.username}</h3>
          <p className="text-sm text-gray-600">{props.user.email}</p>
        </div>
      </div>
      <button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        onClick={() => props.onFollow(props.user.id)}
      >
        Add
      </button>
    </div>
  );
};

export default UserCard;
