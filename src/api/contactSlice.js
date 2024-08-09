import { apiSlice } from "./apiSlice";

export const contactSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    contactInfo: builder.mutation({
      query: (credentials) => ({
        url: "/support/contact-us/",
        method: "POST",
        headers: { "Content-type": "application/json" },
        body: credentials,
      }),
    //   invalidatesTags: ["Users"],
    }),

  }),
});

export const { useContactInfoMutation } = contactSlice;