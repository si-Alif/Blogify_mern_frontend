const SocialLinkInput = ({ defaultValue, platform, value, onChange }) => {
  const platformPatterns = {
    twitter: '(twitter\\.com|x\\.com)',
    facebook: 'facebook\\.com',
    youtube: 'youtube\\.com',
    linkedin: 'linkedin\\.com',
    instagram: 'instagram\\.com',
    reddit: 'reddit\\.com',
    discord: 'discord\\.com',
    whatsapp: 'api.whatsapp.com',
  };

  const validateUrl = (url) => {
    if (!url) return true;
    const regex = new RegExp(`^https?://(www\\.)?${platformPatterns[platform]}/.*$`);
    return regex.test(url);
  };

  const transformUrl = (url) => {
    if (platform === 'twitter') {
      return url.replace(/(https?:\/\/)(www\.)?(twitter\.com|x\.com)/, '$1x.com');
    }
    return url;
  };

  return (
    <div className="flex flex-col">
      <div className="flex items-center gap-3 group">
        <input
          type="url"
          defaultValue={defaultValue}
          // value={value}
          onBlur={(e) => {
            let finalUrl = transformUrl(e.target.value);
            if (!validateUrl(finalUrl)) {
              e.target.setCustomValidity(`Please enter a valid ${platform} URL`);
            } else {
              e.target.setCustomValidity('');
              onChange({ [platform]: finalUrl }); // ✅ Send proper formatted data
            }
          }}
          onChange={(e) => onChange({ [platform]: e.target.value })}
          className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded
                     focus:outline-none focus:ring-2 focus:ring-blue-500
                     bg-white text-black dark:bg-gray-700 dark:text-white"
        />
      </div>
    </div>
  );
};

export default SocialLinkInput;
