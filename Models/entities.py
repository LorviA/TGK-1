from sqlalchemy import Column, Integer, String, Boolean, Date, Float, JSON
from DataBase.base import Base

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True)
    user_name = Column(String)
    password = Column(String)
    email = Column(String)
    rights = Column(Integer)


class ZNO(Base):
    __tablename__ = "zno"

    id = Column(Integer, primary_key=True, index=True)
    st_smet = Column(Float)
    counterparty = Column(String)
    is_mal_or_sred_bis = Column(Boolean)
    confidentiality_of_information = Column(Integer)
    id_case = Column(String)
    date_payment_agreement = Column(Date)
    planned_payment_date = Column(Date)
    is_overdue = Column(Boolean)
    summ = Column(Float)
    str_act = Column(String)
    str_scf = Column(String)
    str_bill = Column(String)
    other_documents = Column(String)
    comment = Column(String)
    id_status = Column(Integer)
    id_zno = Column(String)
    payment_date = Column(Date)
    id_payment_order = Column(String)
    id_user = Column(Integer)
    create_data = Column(Date)
    id_oko = Column(Integer)


class ConfidentialityOfInformation(Base):
    __tablename__ = 'ConfidentialityOfInformation'

    id = Column(Integer, primary_key=True)
    name = Column(String)


class StSmet(Base):
    __tablename__ = 'StSmet'

    id = Column(Integer, primary_key=True)
    st = Column(String)
    description = Column(String)
    is_group = Column(Boolean)

class Logger(Base):
    __tablename__ = "Logger"

    id = Column(Integer, primary_key=True)
    user_id = Column(Integer)
    message = Column(String)
    date_change = Column(Date)