import supabase, { supabaseUrl } from './supabase';

export async function signup({ full_name, email, password }) {
   const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
         data: {
            full_name,
            profileImage: '',
         },
      },
   });

   if (error) throw new Error(error.message);

   return data;
}

export async function login({ email, password }) {
   const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
   });

   if (error) throw new Error(error.message);

   return data;
}

export async function logout() {
   const { error } = await supabase.auth.signOut();
   if (error) throw new Error(error.message);
}

export async function getCurrentUser() {
   const { data: session } = await supabase.auth.getSession();
   if (!session.session) return null;

   const { data, error } = await supabase.auth.getUser();

   if (error) throw new Error(error.message);

   return data?.user;
}

export async function getAuthors() {
   const { data, error } = await supabase
      .from('authors')
      .select()
      .order('id', { ascending: false });

   if (error) throw new Error(error.message);

   return data;
}

export async function getUsers() {
   const { data, error } = await supabase.from('users').select('id, bookmarks');

   if (error) throw new Error(error.message);

   return data;
}

export async function updateUser({
   password,
   full_name,
   description_en,
   description_srb,
   profile_image,
}) {
   // 1. Update password, full_name or description
   let updateData;
   if (password) updateData = { password };
   if (full_name || description_en || description_srb)
      updateData = { data: { full_name, description_en, description_srb } };

   const { data, error } = await supabase.auth.updateUser(updateData);

   if (error) throw new Error(error.message);

   // 2. If profile picture isn't changed, return
   if (!profile_image) return data;

   // 3. Upload the profileImage
   const fileName = `profile_image-${data.user.id}-${Math.random()}`;
   const hasImage = data.user.user_metadata.profile_image;

   // 3.1 Delete the already present image
   if (hasImage) {
      const existingFilePath = data.user.user_metadata.profile_image
         .split('/')
         ?.at(-1);

      const { error: imageDeleteError } = await supabase.storage
         .from('profile_images')
         .remove([existingFilePath]);

      if (imageDeleteError) throw new Error(imageDeleteError.message);
   }

   // 3.2 Finally upload the new image
   const { error: imageUploadError } = await supabase.storage
      .from('profile_images')
      .upload(fileName, profile_image);

   if (imageUploadError) throw new Error(imageUploadError.message);

   // 4. Update profile image in the user
   const { data: updatedUser, error: error2 } = await supabase.auth.updateUser({
      data: {
         profile_image: `${supabaseUrl}/storage/v1/object/public/profile_images/${fileName}`,
      },
   });

   if (error2) throw new Error(error2.message);

   return updatedUser;
}

export async function updateUsersTable(user) {
   const { error } = await supabase
      .from('authors')
      .update({
         full_name: user.full_name,
         description_en: user.description_en,
         description_srb: user.description_srb,
      })
      .eq('id', user.id)
      .select();

   if (error) throw new Error(error.message);

   if (!user.profile_image) return;

   // 2) Upload the profileImage
   const fileName = `profile_image-${user.id}-${Math.random()}`;

   // 2.1) Delete the already present image
   const existingFilePath = user.old_image;

   const { error: imageDeleteError } = await supabase.storage
      .from('profile_images')
      .remove([existingFilePath]);

   if (imageDeleteError) throw new Error(imageDeleteError.message);

   // 2.2) Finally upload the new image
   const { error: imageUploadError } = await supabase.storage
      .from('profile_images')
      .upload(fileName, user.profile_image);

   if (imageUploadError) throw new Error(imageUploadError.message);

   // 3) Update profileImage field in user
   const { error: profileImageError } = await supabase
      .from('authors')
      .update({
         profile_image: `${supabaseUrl}/storage/v1/object/public/profile_images/${fileName}`,
      })
      .eq('id', user.id)
      .select();

   if (profileImageError) throw new Error(profileImageError.message);
}
