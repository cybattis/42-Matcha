namespace backend.Utils;

public static class Files
{
    public static bool IsImageFileValid(byte[] image)
    {
        // JPEG magic number
        if (image[0] == 0xFF && image[1] == 0xD8 && image[2] == 0xFF)
            return true;
        // PNG magic number
        if (image[0] == 0x89 && image[1] == 0x50 && image[2] == 0x4E && image[3] == 0x47 && 
            image[4] == 0x0D && image[5] == 0x0A && image[6] == 0x1A && image[7] == 0x0A)
            return true;
       
        return false;
    }
}