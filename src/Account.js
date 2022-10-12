import { useState, useEffect } from 'react'
import { superBlogClient } from './superBlogClient'

const Account = ({ session }) => {
    const [loading, setLoading] = useState(true)
    const [username, setUsername] = useState(null)
    const [website, setWebsite] = useState(null)
    const [avatar_url, setAvatarUrl] = useState(null)

    useEffect(() => {
        getProfile()
    }, [session])

    const getProfile = async () => {
        try {
            setLoading(true)
            const { user } = session

            let { data, error, status } = await superBlogClient
                .from('profiles')
                .select(`username, website, avatar_url`)
                .eq('id', user.id)
                .single()

            if (error && status !== 406) {
                throw error
            }

            if (data) {
                setUsername(data.username)
                setWebsite(data.website)
                setAvatarUrl(data.avatar_url)
            }
        } catch (error) {
            alert(error.message)
        } finally {
            setLoading(false)
        }
    }

    const updateProfile = async (e) => {
        e.preventDefault()

        try {
            setLoading(true)
            const { user } = session

            const updates = {
                id: user.id,
                username,
                website,
                avatar_url,
                updated_at: new Date(),
            }

            let { error } = await superBlogClient.from('profiles').upsert(updates)

            if (error) {
                throw error
            }
        } catch (error) {
            alert(error.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div>
            <div className="flex min-h-full flex-col justify-center py-12 sm:px-6 lg:px-8 sm:w-3/4 sm:mx-auto">
                <div className="sm:mx-auto sm:w-full sm:max-w-md">
                    <h3 className="text-center text-xl font-bold tracking-tight text-white">Update your profile</h3>
                </div>
                <div className="ring-1 rounded mt-4 sm:mx-auto sm:w-full sm:max-w-md">
                    
                    <div aria-live="polite" className='flex flex-col p-4 '>
                        {loading ? (
                            'Saving ...'
                        ) : (
                            <form onSubmit={updateProfile} className="space-y-6 p-5">
                                <div className="ring-1 inputField block w-full appearance-none rounded-md border  px-3 py-2 text-white shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm" >Email: {session.user.email}</div>
                                <div>
                                    <label htmlFor="username" className="block text-sm font-medium text-white">Name</label>
                                    <input
                                        className="ring-1 inputField bg-slate-800 block w-full text-white appearance-none rounded-md border border-slate-800 px-3 py-2  shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                                        id="username"
                                        type="text"
                                        placeholder="username"
                                        value={username || ''}
                                        onChange={(e) => setUsername(e.target.value)}
                                    />
                                </div>
                                <div>
                                    <label htmlFor="website" className="block text-sm font-medium text-white">Website</label>
                                    <input
                                        className="ring-1 inputField bg-slate-800 block w-full text-white appearance-none rounded-md border border-slate-800 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                                        id="website"
                                        type="url"
                                        value={website || ''}
                                        onChange={(e) => setWebsite(e.target.value)}
                                    />
                                </div>
                                <div className='flex justify-center'>
                                    <button className="flex w-full justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2" disabled={loading}>
                                        Update profile
                                    </button>
                                </div>
                            </form>
                        )}
                        <div className='flex justify-center '>
                        <button
                            type="button"
                            className="flex w-11/12 justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                            onClick={() => superBlogClient.auth.signOut()}
                        >
                            Sign Out
                        </button></div>
                    </div>
                </div>
            </div>
        </div >
    )
}

export default Account