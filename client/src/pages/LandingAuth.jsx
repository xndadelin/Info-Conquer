export const LandingAuth = ({data}) => {
    return (
        <div className="font-bold text-5xl container mx-auto">
            Hello, {data.getUser.username}
        </div>
    )
}