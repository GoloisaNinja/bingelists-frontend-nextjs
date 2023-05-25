export interface Invite {
    _id: string,
    bingeListId: string,
    bingeListName: string,
    invitedByName: string,
    invitedById: string,
    invitedName: string,
    invitedId: string,
    message: string,
    pending: boolean
}
export interface IInviteData {
    bingeListId: string,
    bingeListName: string,
    invitedByName: string,
    invitedById: string,
    invitedName: string,
    invitedId: string,
    message: string,
}
