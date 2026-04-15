function SauceDetailMedia({ imageUrl, name }: { imageUrl: string; name: string }) {
  return (
    <div className="relative lg:w-1/2">
      <div className="aspect-[4/3] w-full overflow-hidden bg-background lg:aspect-auto lg:min-h-[420px] lg:h-full">
        <img src={imageUrl} alt={name} loading="eager" decoding="async" className="h-full w-full object-cover transition duration-700 hover:scale-[1.02]"/>
      </div>
    </div>
  );
}

export default SauceDetailMedia;
