import { INewUser } from '@/types'
import {

    useQuery,
    useMutation,
    useQueryClient,
    useInfiniteQuery,

} from '@tanstack/react-query'
import { createNewUser, signInAccount } from '../appwrite/api'

export const useCreateUserAccount = () =>{
    return useMutation(
        {
            mutationFn: (user: INewUser) => createNewUser(user)
        }
    )
}

export const useSignInAccount = () =>{
    return useMutation(
        {
            mutationFn: (user:
                {
                    email: string;
                    password: string;
                }
            ) => signInAccount(user)
        }
    )
}