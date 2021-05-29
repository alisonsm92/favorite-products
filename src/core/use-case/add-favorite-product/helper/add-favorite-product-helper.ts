const isSameId = (searchId: string) => ({ id }: {id: string}) :boolean => searchId === id;

export default isSameId;
