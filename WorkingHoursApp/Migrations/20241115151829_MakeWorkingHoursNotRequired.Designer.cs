﻿// <auto-generated />
using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using WorkingHoursApp.Data;

#nullable disable

namespace WorkingHoursApp.Migrations
{
    [DbContext(typeof(AppDbContext))]
    [Migration("20241115151829_MakeWorkingHoursNotRequired")]
    partial class MakeWorkingHoursNotRequired
    {
        /// <inheritdoc />
        protected override void BuildTargetModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder.HasAnnotation("ProductVersion", "9.0.0");

            modelBuilder.Entity("WorkingHoursApp.Models.AbsenceType", b =>
                {
                    b.Property<int>("AbsenceTypeID")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("INTEGER");

                    b.Property<string>("AbsenceName")
                        .IsRequired()
                        .HasColumnType("TEXT");

                    b.HasKey("AbsenceTypeID");

                    b.ToTable("AbsenceTypes");
                });

            modelBuilder.Entity("WorkingHoursApp.Models.User", b =>
                {
                    b.Property<int>("UserID")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("INTEGER");

                    b.Property<bool>("ActiveStatus")
                        .HasColumnType("INTEGER");

                    b.Property<string>("Comment")
                        .IsRequired()
                        .HasColumnType("TEXT");

                    b.Property<string>("Email")
                        .IsRequired()
                        .HasColumnType("TEXT");

                    b.Property<string>("FirstName")
                        .IsRequired()
                        .HasColumnType("TEXT");

                    b.Property<string>("JobPosition")
                        .IsRequired()
                        .HasColumnType("TEXT");

                    b.Property<string>("LastName")
                        .IsRequired()
                        .HasColumnType("TEXT");

                    b.Property<string>("Password")
                        .IsRequired()
                        .HasColumnType("TEXT");

                    b.Property<string>("PhoneNumber")
                        .IsRequired()
                        .HasColumnType("TEXT");

                    b.Property<int>("TypeOfEmployment")
                        .HasColumnType("INTEGER");

                    b.Property<string>("Username")
                        .IsRequired()
                        .HasColumnType("TEXT");

                    b.HasKey("UserID");

                    b.ToTable("Users");
                });

            modelBuilder.Entity("WorkingHoursApp.Models.WorkingHours", b =>
                {
                    b.Property<int>("WorkingHoursID")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("INTEGER");

                    b.Property<int?>("AbsenceTypeID")
                        .HasColumnType("INTEGER");

                    b.Property<TimeSpan>("ArrivalTime")
                        .HasColumnType("TEXT");

                    b.Property<DateTime>("Date")
                        .HasColumnType("TEXT");

                    b.Property<TimeSpan>("DepartureTime")
                        .HasColumnType("TEXT");

                    b.Property<bool>("IsAbsent")
                        .HasColumnType("INTEGER");

                    b.Property<TimeSpan>("LunchEndTime")
                        .HasColumnType("TEXT");

                    b.Property<TimeSpan>("LunchStartTime")
                        .HasColumnType("TEXT");

                    b.Property<int>("UserID")
                        .HasColumnType("INTEGER");

                    b.HasKey("WorkingHoursID");

                    b.HasIndex("AbsenceTypeID");

                    b.HasIndex("UserID");

                    b.ToTable("WorkingHours");
                });

            modelBuilder.Entity("WorkingHoursApp.Models.WorkingHours", b =>
                {
                    b.HasOne("WorkingHoursApp.Models.AbsenceType", "AbsenceType")
                        .WithMany("WorkingHours")
                        .HasForeignKey("AbsenceTypeID");

                    b.HasOne("WorkingHoursApp.Models.User", "User")
                        .WithMany("WorkingHours")
                        .HasForeignKey("UserID")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("AbsenceType");

                    b.Navigation("User");
                });

            modelBuilder.Entity("WorkingHoursApp.Models.AbsenceType", b =>
                {
                    b.Navigation("WorkingHours");
                });

            modelBuilder.Entity("WorkingHoursApp.Models.User", b =>
                {
                    b.Navigation("WorkingHours");
                });
#pragma warning restore 612, 618
        }
    }
}
