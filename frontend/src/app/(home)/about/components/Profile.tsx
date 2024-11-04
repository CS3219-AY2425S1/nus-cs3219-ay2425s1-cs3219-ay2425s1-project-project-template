const ProfileItem = ({ name, img }: { name: string, img: string }) => {
  return (
    <div className="mx-auto max-w-6xl w-64">
      <h1 className="text-yellow-500 text-xl">{name}</h1>
      <img src={img} className="w-40 rounded-xl"/>
    </div>
  );
}

export default ProfileItem;