import Avatar from "react-avatar";

function ViewMembers({ clients }) {
  console.log("Clients", clients);
  return (
    <div className="flex flex-col p-2 ">
      <div className="pb-2 text-xl font-bold">Members</div>
      <div className="flex flex-col justify-between h-full ">
        <div className="flex flex-wrap pb-4 overflow-auto ">
          {clients.length > 0 &&
            clients.map((client) => (
              <User
                key={client.id}
                username={client.username}
                userColor={client.userColor}
              />
            ))}
        </div>
      </div>
    </div>
  );
}

function User({ username, userColor }) {
  return (
    <div
      key={username}
      className="flex flex-col items-center gap-1  basis-[33.33%]  w-fit"
    >
      <Avatar name={username} size={60} round="14px" color={userColor} />
      <span className="text-[15px] text-center">{username}</span>
    </div>
  );
}
export default ViewMembers;
