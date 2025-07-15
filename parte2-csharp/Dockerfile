FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

COPY ["DesafioElawParte2.csproj", "./"]
RUN dotnet restore "DesafioElawParte2.csproj"

COPY . .
RUN dotnet build "DesafioElawParte2.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "DesafioElawParte2.csproj" -c Release -o /app/publish

FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS final
WORKDIR /app
COPY --from=publish /app/publish .

ENTRYPOINT ["dotnet", "DesafioElawParte2.dll"] 