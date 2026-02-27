using backend.Repositories;
using backend.Services;
using Dapper;
using Scalar.AspNetCore;
using System.Text.Json;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();

DefaultTypeMap.MatchNamesWithUnderscores = true;

// add Controllers service
builder.Services.AddControllers(options =>
{
    options.SuppressAsyncSuffixInActionNames = false;
})
.AddJsonOptions(options =>
{
    options.JsonSerializerOptions.PropertyNamingPolicy = JsonNamingPolicy.CamelCase;
});

builder.Services.AddScoped<IEmployeeRepository, EmployeeRepository>();
builder.Services.AddScoped<IPayrollService, PayrollService>();
//builder.Services.AddValidatorsFromAssemblyContaining<VideoGameValidator>();

 builder.Services.AddCors(options =>
 {
     options.AddPolicy("AllowReactApp",
         policy =>
         {
             policy.WithOrigins("http://localhost:5173").AllowAnyHeader().AllowAnyMethod();
         });
 });

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
    app.MapScalarApiReference(); 
}

app.UseHttpsRedirection();

app.UseCors("AllowReactApp");

// Map controllers routes
app.MapControllers();

app.Run();

