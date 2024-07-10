export const Error = ({ error }) => {
  return (
    <section className={`flex absolute bottom-0 left-0 bg-red-800 items-center p-4 text-white rounded-lg`} role="alert">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="red" class="w-10 h-10    ">
        <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
      </svg>
      <span className="ml-2">{error}</span>
    </section>
  )
}