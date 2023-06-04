interface ProfileProps {
  username: string,
  following: [string],
  followers: [string],
  streak: number
}

export const Profile = ({ username, following, followers, streak }: ProfileProps) => {
}
