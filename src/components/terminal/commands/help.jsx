export const help = (links = [], executeCommand) => {


  return <div>
    {links.map((link) => (
      <div key={link.name}>
        <div onClick={() => {
          executeCommand(link.name)
        }}>{link.name}</div>
      </div>
    ))}
  </div>
}


