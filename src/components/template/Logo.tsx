export default function Logo() {
  return (
    <div
      className={`
            flex h-12 w-12 flex-col
            items-center justify-center rounded-full
            bg-white
        `}
    >
      <div className="mb-0.5 h-3 w-3 rounded-full bg-red-600" />
      <div className="mt-0.5 flex">
        <div className="mr-0.5 h-3 w-3 rounded-full bg-yellow-500" />
        <div className="ml-0.5 h-3 w-3 rounded-full bg-green-600" />
      </div>
    </div>
  )
}
