import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export function useBioLinks() {
    return useQuery({
        queryKey: ["bio-links"],
        queryFn: async () => {
            const res = await fetch("/api/bio-links");
            if (!res.ok) throw new Error("Failed to fetch bio links");
            return res.json();
        },
    });
}

export function useCreateBioLink() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (data: any) => {
            const res = await fetch("/api/bio-links", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });
            if (!res.ok) throw new Error("Failed to create bio link");
            return res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["bio-links"] });
        },
    });
}

export function useUpdateBioLink() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ id, data }: { id: string; data: any }) => {
            const res = await fetch(`/api/bio-links/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });
            if (!res.ok) throw new Error("Failed to update bio link");
            return res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["bio-links"] });
        },
    });
}

export function useDeleteBioLink() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (id: string) => {
            const res = await fetch(`/api/bio-links/${id}`, {
                method: "DELETE",
            });
            if (!res.ok) throw new Error("Failed to delete bio link");
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["bio-links"] });
        },
    });
}
